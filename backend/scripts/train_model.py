"""Train Random Forest phishing detection model."""

import sys
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.config import FEATURE_NAMES_PATH, MODEL_DIR, MODEL_PATH
from app.features.url_features import FEATURE_NAMES, extract_features
from scripts.generate_dataset import generate_dataset


def build_feature_matrix(urls: list[str]) -> np.ndarray:
    return np.array([[extract_features(url)[name] for name in FEATURE_NAMES] for url in urls])


def train() -> dict:
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    data_path = generate_dataset()

    df = pd.read_csv(data_path)
    X = build_feature_matrix(df["url"].tolist())
    y = df["label"].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=12,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, target_names=["legitimate", "phishing"])

    joblib.dump(model, MODEL_PATH)
    joblib.dump(FEATURE_NAMES, FEATURE_NAMES_PATH)

    print(f"\nModel saved to {MODEL_PATH}")
    print(f"Accuracy: {accuracy:.4f}")
    print(report)

    return {"accuracy": accuracy, "model_path": str(MODEL_PATH)}


if __name__ == "__main__":
    train()
