from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"
DATA_DIR = BASE_DIR / "data"
DB_PATH = BASE_DIR / "data" / "phishguard.db"

MODEL_PATH = MODEL_DIR / "phishing_model.joblib"
FEATURE_NAMES_PATH = MODEL_DIR / "feature_names.joblib"

API_HOST = "0.0.0.0"
API_PORT = 8000
