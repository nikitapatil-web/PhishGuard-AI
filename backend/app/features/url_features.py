"""Extract ML features from URLs for phishing detection."""

import re
from urllib.parse import urlparse

import tldextract

SUSPICIOUS_KEYWORDS = {
    "login", "verify", "secure", "account", "update", "confirm", "banking",
    "password", "signin", "wallet", "paypal", "amazon", "microsoft", "apple",
    "free", "prize", "winner", "urgent", "suspend", "click", "reset",
}

BRAND_NAMES = {
    "paypal", "amazon", "microsoft", "google", "apple", "facebook", "instagram",
    "netflix", "chase", "wellsfargo", "bankofamerica", "icloud", "dropbox",
}

SUSPICIOUS_TLDS = {".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".buzz", ".icu"}


def _ensure_scheme(url: str) -> str:
    url = url.strip()
    if not url.startswith(("http://", "https://")):
        url = "http://" + url
    return url


def extract_features(url: str) -> dict[str, float]:
    """Return a feature dict for a single URL."""
    url = _ensure_scheme(url)
    parsed = urlparse(url)
    hostname = parsed.netloc or parsed.path.split("/")[0]
    path = parsed.path or ""
    query = parsed.query or ""

    extracted = tldextract.extract(url)
    domain = extracted.domain
    subdomain = extracted.subdomain
    suffix = extracted.suffix
    full_domain = f"{domain}.{suffix}" if suffix else domain

    url_lower = url.lower()
    hostname_lower = hostname.lower()

    has_ip = 1.0 if re.match(r"^(\d{1,3}\.){3}\d{1,3}$", hostname.split(":")[0]) else 0.0
    has_https = 1.0 if parsed.scheme == "https" else 0.0
    url_length = float(len(url))
    hostname_length = float(len(hostname))
    path_length = float(len(path))
    num_dots = float(url.count("."))
    num_hyphens = float(url.count("-"))
    num_underscores = float(url.count("_"))
    num_slashes = float(url.count("/"))
    num_digits = float(sum(c.isdigit() for c in url))
    num_special = float(len(re.findall(r"[@%&=?!#]", url)))
    num_subdomains = float(len(subdomain.split(".")) if subdomain else 0)
    has_at_symbol = 1.0 if "@" in url else 0.0
    has_port = 1.0 if ":" in hostname and not has_ip else 0.0
    has_double_slash = 1.0 if "//" in path else 0.0

    keyword_hits = sum(1 for kw in SUSPICIOUS_KEYWORDS if kw in url_lower)
    suspicious_keyword_ratio = keyword_hits / max(len(SUSPICIOUS_KEYWORDS), 1)

    brand_in_url = sum(1 for brand in BRAND_NAMES if brand in url_lower)
    brand_in_domain = sum(1 for brand in BRAND_NAMES if brand in full_domain.lower())
    brand_impersonation = 1.0 if brand_in_url > 0 and brand_in_domain == 0 else 0.0

    suspicious_tld = 1.0 if any(hostname_lower.endswith(tld) for tld in SUSPICIOUS_TLDS) else 0.0

    digit_ratio = num_digits / max(url_length, 1)
    special_ratio = num_special / max(url_length, 1)

    long_subdomain = 1.0 if len(subdomain) > 20 else 0.0
    short_domain = 1.0 if 0 < len(domain) < 4 else 0.0

    homoglyph_pattern = 1.0 if re.search(r"(paypa[1l]|g00gle|micros0ft|amaz0n|faceb00k)", url_lower) else 0.0

    entropy = _shannon_entropy(domain) if domain else 0.0

    return {
        "url_length": url_length,
        "hostname_length": hostname_length,
        "path_length": path_length,
        "num_dots": num_dots,
        "num_hyphens": num_hyphens,
        "num_underscores": num_underscores,
        "num_slashes": num_slashes,
        "num_digits": num_digits,
        "num_special": num_special,
        "num_subdomains": num_subdomains,
        "has_ip": has_ip,
        "has_https": has_https,
        "has_at_symbol": has_at_symbol,
        "has_port": has_port,
        "has_double_slash": has_double_slash,
        "suspicious_keyword_ratio": suspicious_keyword_ratio,
        "brand_impersonation": brand_impersonation,
        "suspicious_tld": suspicious_tld,
        "digit_ratio": digit_ratio,
        "special_ratio": special_ratio,
        "long_subdomain": long_subdomain,
        "short_domain": short_domain,
        "homoglyph_pattern": homoglyph_pattern,
        "domain_entropy": entropy,
        "query_length": float(len(query)),
    }


def _shannon_entropy(text: str) -> float:
    if not text:
        return 0.0
    from collections import Counter
    import math

    counts = Counter(text)
    length = len(text)
    return -sum((c / length) * math.log2(c / length) for c in counts.values())


FEATURE_NAMES = list(extract_features("https://example.com").keys())
