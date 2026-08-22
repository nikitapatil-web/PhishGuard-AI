"""FastAPI service for URL threat analysis and scan history."""

import sys
import re
import base64
import csv
import json
import os
import socket
import urllib.request
from ipaddress import ip_address
from io import BytesIO
from io import StringIO
from datetime import datetime, timezone
from pathlib import Path
from sqlite3 import Connection, connect
from urllib.parse import urlparse

import joblib
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.config import DB_PATH, FEATURE_NAMES_PATH, MODEL_PATH
from app.features.url_features import extract_features


class ScanRequest(BaseModel):
    url: str = Field(min_length=3, max_length=2048)


class ScanRecord(BaseModel):
    id: int
    url: str
    score: int
    riskLevel: str
    timestamp: str
    threatType: str | None = None
    aiExplanation: str
    signalVectors: list[dict[str, str]]
    safetyProtocol: list[dict[str, str]]
    externalChecks: list[dict[str, str]] = []
    websiteAnalysis: list[str] = []
    reasons: list[str] = []


app = FastAPI(title="PhishGuard AI API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _database() -> Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    database = connect(DB_PATH)
    database.execute(
        """CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            score INTEGER NOT NULL,
            risk_level TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            threat_type TEXT,
            explanation TEXT NOT NULL,
            signals TEXT NOT NULL,
            safety TEXT NOT NULL
        )"""
    )
    database.commit()
    return database


def _model_prediction(url: str, features: dict[str, float]) -> float:
    if not MODEL_PATH.exists() or not FEATURE_NAMES_PATH.exists():
        keyword_score = features["suspicious_keyword_ratio"] * 60
        indicator_score = (
            features["suspicious_tld"] * 30
            + features["brand_impersonation"] * 25
            + features["homoglyph_pattern"] * 35
            + features["has_ip"] * 25
            + (1 - features["has_https"]) * 10
        )
        return min(99.0, keyword_score + indicator_score)

    model = joblib.load(MODEL_PATH)
    feature_names = joblib.load(FEATURE_NAMES_PATH)
    vector = np.array([[features[name] for name in feature_names]])
    probabilities = model.predict_proba(vector)[0]
    return float(probabilities[1] * 100)


def _build_record(url: str, score: int, timestamp: str, record_id: int, inspect_website: bool = True) -> ScanRecord:
    features = extract_features(url)
    hostname = urlparse(url if "://" in url else f"http://{url}").hostname or url
    risk_level = "high-risk" if score >= 70 else "suspicious" if score >= 40 else "safe"
    threat_type = "Phishing" if risk_level != "safe" else None
    signals = [
        {"name": "Suspicious URL Patterns", "status": "fail" if features["suspicious_keyword_ratio"] > 0.05 else "pass", "detail": f"{int(features['suspicious_keyword_ratio'] * 25)} suspicious indicators detected"},
        {"name": "Domain & TLD Reputation", "status": "fail" if features["suspicious_tld"] else "pass", "detail": "Suspicious top-level domain" if features["suspicious_tld"] else "Standard domain suffix"},
        {"name": "Brand Impersonation", "status": "fail" if features["brand_impersonation"] or features["homoglyph_pattern"] else "pass", "detail": "Possible brand impersonation detected" if features["brand_impersonation"] or features["homoglyph_pattern"] else "No impersonation pattern detected"},
        {"name": "Transport Security", "status": "warning" if not features["has_https"] else "pass", "detail": "URL does not use HTTPS" if not features["has_https"] else "HTTPS scheme detected"},
    ]
    explanation = (
        f"{hostname} received a {score}/100 threat score. "
        + ("The URL contains patterns commonly associated with phishing or social engineering." if risk_level != "safe" else "No strong phishing indicators were found in the URL structure.")
    )
    safety = [
        {"text": "Do not enter credentials unless you trust the destination", "type": "dont" if risk_level != "safe" else "do"},
        {"text": "Verify the domain through an independent source", "type": "do"},
    ]
    reasons: list[str] = []
    if features["suspicious_keyword_ratio"] > 0:
        reasons.append("The URL contains suspicious words commonly used in phishing links.")
    if features["suspicious_tld"]:
        reasons.append("The domain uses a top-level domain frequently seen in suspicious links.")
    if features["brand_impersonation"] or features["homoglyph_pattern"]:
        reasons.append("The URL may imitate a trusted brand or use deceptive spelling.")
    if features["has_ip"]:
        reasons.append("The destination uses an IP address instead of a normal domain name.")
    if not features["has_https"]:
        reasons.append("The URL does not use HTTPS, so the connection is not securely encrypted.")
    if features["long_subdomain"] or features["url_length"] > 120:
        reasons.append("The URL has an unusually long or complex structure.")
    if not reasons:
        reasons.append("No strong phishing indicators were found in the URL structure.")
    website_analysis = _inspect_website(url) if inspect_website else []
    external_checks = _external_checks(url) if inspect_website else []
    return ScanRecord(id=record_id, url=url, score=score, riskLevel=risk_level, timestamp=timestamp, threatType=threat_type, aiExplanation=explanation, signalVectors=signals, safetyProtocol=safety, externalChecks=external_checks, websiteAnalysis=website_analysis, reasons=reasons)


def _inspect_website(url: str) -> list[str]:
    """Inspect a small public page snapshot without following redirects."""
    parsed = urlparse(url if "://" in url else f"http://{url}")
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        return ["Website content was not inspected: unsupported URL scheme."]
    try:
        addresses = socket.getaddrinfo(parsed.hostname, None)
        if any(ip_address(address[4][0]).is_private or ip_address(address[4][0]).is_loopback or ip_address(address[4][0]).is_link_local or ip_address(address[4][0]).is_reserved for address in addresses):
            return ["Website content was not inspected: private network destinations are blocked."]
        request = urllib.request.Request(url, headers={"User-Agent": "PhishGuard-AI-Scanner/1.0"})
        with urllib.request.urlopen(request, timeout=3) as response:
            content_type = response.headers.get_content_type()
            if content_type not in {"text/html", "application/xhtml+xml"}:
                return [f"Website content was not inspected: response type is {content_type}."]
            page = response.read(1_000_001).decode("utf-8", errors="ignore")
        title_match = re.search(r"<title[^>]*>(.*?)</title>", page, flags=re.IGNORECASE | re.DOTALL)
        title = re.sub(r"\\s+", " ", title_match.group(1)).strip() if title_match else "No page title found"
        findings = [f"Page title: {title[:160]}"]
        if re.search(r"<form", page, flags=re.IGNORECASE):
            findings.append("Login or data-entry form detected.")
        if re.search(r"type=[\\\"']password[\\\"']|password", page, flags=re.IGNORECASE):
            findings.append("Password-related content detected.")
        urgency = len(re.findall(r"urgent|verify now|account suspended|confirm identity|limited time", page, flags=re.IGNORECASE))
        if urgency:
            findings.append(f"Urgency language detected ({urgency} match{'es' if urgency != 1 else ''}).")
        if len(page) >= 1_000_001:
            findings.append("Only the first 1MB of page content was inspected.")
        return findings
    except Exception as error:
        return [f"Website content could not be inspected: {type(error).__name__}."]


def _external_checks(url: str) -> list[dict[str, str]]:
    """Run optional reputation checks without requiring any API key."""
    checks: list[dict[str, str]] = []
    google_key = os.getenv("GOOGLE_SAFE_BROWSING_API_KEY")
    if google_key:
        try:
            import urllib.request
            payload = json.dumps({"client": {"clientId": "phishguard-ai", "clientVersion": "1.0"}, "threatInfo": {"threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"], "platformTypes": ["ANY_PLATFORM"], "threatEntryTypes": ["URL"], "threatEntries": [{"url": url}]}}).encode()
            request = urllib.request.Request(f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={google_key}", data=payload, headers={"Content-Type": "application/json"})
            response = urllib.request.urlopen(request, timeout=3)
            checks.append({"provider": "Google Safe Browsing", "status": "threat-found" if json.loads(response.read()) else "clear"})
        except Exception:
            checks.append({"provider": "Google Safe Browsing", "status": "unavailable"})
    virus_total_key = os.getenv("VIRUSTOTAL_API_KEY")
    if virus_total_key:
        try:
            import urllib.request
            encoded_url = base64.urlsafe_b64encode(url.encode()).decode().rstrip("=")
            request = urllib.request.Request(f"https://www.virustotal.com/api/v3/urls/{encoded_url}", headers={"x-apikey": virus_total_key})
            response = urllib.request.urlopen(request, timeout=3)
            stats = json.loads(response.read())["data"]["attributes"]["last_analysis_stats"]
            checks.append({"provider": "VirusTotal", "status": "threat-found" if stats.get("malicious", 0) else "clear", "detections": str(stats.get("malicious", 0))})
        except Exception:
            checks.append({"provider": "VirusTotal", "status": "unavailable"})
    return checks


def _save_record(record: ScanRecord) -> ScanRecord:
    database = _database()
    cursor = database.execute(
        "INSERT INTO scans (url, score, risk_level, timestamp, threat_type, explanation, signals, safety) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (record.url, record.score, record.riskLevel, record.timestamp, record.threatType, record.aiExplanation, str(record.signalVectors), str(record.safetyProtocol)),
    )
    database.commit()
    record.id = cursor.lastrowid or 0
    database.close()
    return record


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/scan", response_model=ScanRecord)
def scan(request: ScanRequest) -> ScanRecord:
    url = request.url.strip()
    parsed = urlparse(url if "://" in url else f"http://{url}")
    if not parsed.hostname:
        raise HTTPException(status_code=422, detail="Enter a valid URL or domain")

    score = round(_model_prediction(url, extract_features(url)))
    timestamp = datetime.now(timezone.utc).isoformat()
    record = _build_record(url, score, timestamp, 0)
    return _save_record(record)


@app.post("/api/scan-file", response_model=ScanRecord)
async def scan_file(file: UploadFile = File(...)) -> ScanRecord:
    allowed_types = {".pdf", ".html", ".htm", ".eml", ".txt"}
    extension = Path(file.filename or "").suffix.lower()
    if extension not in allowed_types:
        raise HTTPException(status_code=415, detail="Upload a PDF, HTML, EML, or TXT file")

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File must be 10MB or smaller")

    text = content.decode("utf-8", errors="ignore")
    urls = re.findall(r"https?://[^\s<>\"']+", text, flags=re.IGNORECASE)
    url = urls[0].rstrip(".,;)") if urls else f"http://uploaded-file.local/{file.filename or 'document'}"
    features = extract_features(url)
    content_score = min(35, len(re.findall(r"login|password|verify|urgent|account|credential", text, flags=re.IGNORECASE)) * 5)
    score = round(min(99, max(_model_prediction(url, features), content_score)))
    timestamp = datetime.now(timezone.utc).isoformat()
    return _save_record(_build_record(url, score, timestamp, 0))


@app.post("/api/scan-csv", response_model=list[ScanRecord])
async def scan_csv(file: UploadFile = File(...)) -> list[ScanRecord]:
    if Path(file.filename or "").suffix.lower() != ".csv":
        raise HTTPException(status_code=415, detail="Upload a CSV file")
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File must be 10MB or smaller")
    rows = list(csv.DictReader(StringIO(content.decode("utf-8-sig", errors="ignore"))))
    if not rows or "url" not in rows[0]:
        raise HTTPException(status_code=422, detail="CSV must contain a 'url' column")
    records: list[ScanRecord] = []
    for row in rows[:100]:
        url = row.get("url", "").strip()
        if not url:
            continue
        parsed = urlparse(url if "://" in url else f"http://{url}")
        if parsed.hostname:
            score = round(_model_prediction(url, extract_features(url)))
            records.append(_save_record(_build_record(url, score, datetime.now(timezone.utc).isoformat(), 0)))
    if not records:
        raise HTTPException(status_code=422, detail="CSV contains no valid URLs")
    return records


@app.post("/api/scan-qr", response_model=ScanRecord)
async def scan_qr(file: UploadFile = File(...)) -> ScanRecord:
    if Path(file.filename or "").suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
        raise HTTPException(status_code=415, detail="Upload a PNG, JPG, or WEBP QR image")
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image must be 10MB or smaller")
    try:
        import cv2
        import numpy as np
        image = cv2.imdecode(np.frombuffer(BytesIO(content).getbuffer(), dtype=np.uint8), cv2.IMREAD_COLOR)
        decoded_url, _, _ = cv2.QRCodeDetector().detectAndDecode(image)
    except ImportError as error:
        raise HTTPException(status_code=503, detail="QR decoder dependency is not installed") from error
    if not decoded_url:
        raise HTTPException(status_code=422, detail="No QR code could be decoded from this image")
    parsed = urlparse(decoded_url if "://" in decoded_url else f"http://{decoded_url}")
    if not parsed.hostname:
        raise HTTPException(status_code=422, detail="The QR code does not contain a valid URL")
    score = round(_model_prediction(decoded_url, extract_features(decoded_url)))
    return _save_record(_build_record(decoded_url, score, datetime.now(timezone.utc).isoformat(), 0))


@app.get("/api/history", response_model=list[ScanRecord])
def history() -> list[ScanRecord]:
    database = _database()
    rows = database.execute("SELECT id, url, score, timestamp, threat_type FROM scans ORDER BY id DESC LIMIT 50").fetchall()
    database.close()
    return [_build_record(url, score, timestamp, record_id, inspect_website=False) for record_id, url, score, timestamp, _ in rows]