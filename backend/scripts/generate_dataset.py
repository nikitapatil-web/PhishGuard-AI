"""Generate training dataset for phishing URL detection."""

import csv
import random
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

LEGITIMATE_URLS = [
    "https://www.google.com",
    "https://github.com",
    "https://stackoverflow.com",
    "https://www.wikipedia.org",
    "https://www.amazon.com",
    "https://www.microsoft.com",
    "https://www.apple.com",
    "https://www.linkedin.com",
    "https://twitter.com",
    "https://www.youtube.com",
    "https://www.reddit.com",
    "https://medium.com",
    "https://www.nytimes.com",
    "https://www.bbc.com",
    "https://www.cloudflare.com",
    "https://docs.python.org",
    "https://react.dev",
    "https://vitejs.dev",
    "https://www.paypal.com/us/home",
    "https://www.chase.com",
    "https://www.netflix.com",
    "https://openai.com",
    "https://www.nvidia.com",
    "https://www.adobe.com",
    "https://www.spotify.com",
    "https://www.instagram.com",
    "https://www.facebook.com",
    "https://www.dropbox.com",
    "https://slack.com",
    "https://www.notion.so",
    "https://www.figma.com",
    "https://vercel.com",
    "https://www.digitalocean.com",
    "https://www.heroku.com",
    "https://www.mongodb.com",
    "https://www.postgresql.org",
    "https://nodejs.org",
    "https://www.docker.com",
    "https://kubernetes.io",
    "https://aws.amazon.com",
    "https://portal.azure.com",
    "https://cloud.google.com",
    "https://www.kaggle.com",
    "https://huggingface.co",
    "https://www.coursera.org",
    "https://www.udemy.com",
    "https://www.khanacademy.org",
    "https://www.imdb.com",
    "https://www.twitch.tv",
    "https://www.discord.com",
]

PHISHING_TEMPLATES = [
    "http://secure-{brand}-login.xyz/verify",
    "http://{brand}-account-update.tk/signin",
    "http://paypa1-secure.net/update?id={id}",
    "http://micros0ft-update.net/patch/{id}",
    "http://amaz0n-deals.tk/offer/{id}",
    "http://free-prize-winner.com/claim?user={id}",
    "http://192.168.{a}.{b}/login",
    "http://secure-bank-login.xyz/verify?session={id}",
    "http://{brand}-security-alert.ml/confirm",
    "http://login-{brand}-verify.ga/auth",
    "http://www.{brand}-support.xyz/reset-password",
    "http://account-{brand}-locked.cf/unlock",
    "http://{brand}-billing-update.top/payment",
    "http://verify-{brand}-identity.icu/otp",
    "http://{brand}-refund-process.buzz/claim",
    "http://urgent-{brand}-notice.xyz/action",
    "http://wallet-{brand}-sync.ml/connect",
    "http://{brand}-cloud-storage.ga/download",
    "http://signin-{brand}-portal.tk/credentials",
    "http://{brand}-reward-center.top/redeem",
]

BRANDS = ["paypal", "amazon", "microsoft", "apple", "google", "chase", "netflix", "facebook", "instagram", "dropbox"]


def generate_dataset(output_path: Path | None = None, n_legitimate: int = 200, n_phishing: int = 400) -> Path:
    output_path = output_path or DATA_DIR / "training_data.csv"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    rows: list[tuple[str, int]] = []

    for url in LEGITIMATE_URLS:
        rows.append((url, 0))
        if random.random() > 0.5:
            rows.append((url + "/docs", 0))
            rows.append((url + "/about", 0))

    while len([r for r in rows if r[1] == 0]) < n_legitimate:
        base = random.choice(LEGITIMATE_URLS)
        suffix = random.choice(["", "/blog", "/docs", "/help", "/pricing", "/contact", "/api/v1"])
        rows.append((base + suffix, 0))

    while len([r for r in rows if r[1] == 1]) < n_phishing:
        template = random.choice(PHISHING_TEMPLATES)
        url = template.format(
            brand=random.choice(BRANDS),
            id=random.randint(1000, 99999),
            a=random.randint(1, 254),
            b=random.randint(1, 254),
        )
        rows.append((url, 1))

    random.shuffle(rows)

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["url", "label"])
        writer.writerows(rows)

    print(f"Generated {len(rows)} samples -> {output_path}")
    return output_path


if __name__ == "__main__":
    generate_dataset()
