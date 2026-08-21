# PhishGuard AI — Image Asset Guide

Place generated images in this folder using the filenames below.
Reference prompts are in the project README / design spec.

## Color Scheme
| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#2563eb` | Buttons, accents |
| Success | `#10b981` | Safe status |
| Warning | `#f59e0b` | Suspicious alerts |
| Danger | `#ef4444` | High-risk threats |
| Background | `#0f172a` | Page background |

## Asset Index

| # | Filename | Section | Used In |
|---|----------|---------|---------|
| 1 | `01-hero-banner.webp` | Homepage | Home hero background |
| 2 | `02-shield-icon.png` | Homepage | Logo / favicon |
| 3 | `03-url-scanner-illustration.webp` | URL Scanner | Scanner section |
| 4 | `04-search-scan-icon.png` | URL Scanner | Scan button icon |
| 5 | `05-risk-meter-gauge.webp` | Risk Score | Analysis page |
| 6 | `06-safe-status-icon.png` | Risk Score | Safe badge |
| 7 | `07-warning-status-icon.png` | Risk Score | Suspicious badge |
| 8 | `08-danger-status-icon.png` | Risk Score | High-risk badge |
| 9 | `09-ai-brain-neural-network.webp` | AI/ML | AI section |
| 10 | `10-ml-model-visualization.webp` | AI/ML | ML explanation |
| 11 | `11-ai-robot-security.png` | AI/ML | AI mascot |
| 12 | `12-analytics-dashboard.webp` | Dashboard | Reports hero |
| 13 | `13-bar-chart-graphic.webp` | Dashboard | Attack vectors |
| 14 | `14-circular-progress-chart.png` | Dashboard | Accuracy ring |
| 15 | `15-statistics-icons-set.webp` | Dashboard | KPI icons |
| 16 | `16-qr-code-scanner.webp` | QR Scanner | QR page |
| 17 | `17-qr-code-security.png` | QR Scanner | Secure QR icon |
| 18 | `18-camera-upload-icon.png` | QR Scanner | Upload button |
| 19 | `19-phishing-attack-concept.webp` | Simulator | Attack intro |
| 20 | `20-fake-login-page.webp` | Simulator | Education panel |
| 21 | `21-protection-shield.webp` | Simulator | Defense visual |
| 22 | `22-attack-flow-diagram.webp` | Simulator | Attack steps |
| 23 | `23-protection-flow-diagram.webp` | Simulator | Defense steps |
| 24 | `24-ai-explanation-concept.webp` | Explainable AI | Analysis page |
| 25 | `25-analysis-report.webp` | Explainable AI | Report card |
| 26 | `26-safety-tips-illustration.webp` | Safety | Protocol section |
| 27 | `27-security-best-practices.webp` | Safety | Tips grid |
| 28 | `28-history-timeline.webp` | History | History page |
| 29 | `29-clock-time-icon.png` | History | Time icon |
| 30 | `30-abstract-tech-background.webp` | Backgrounds | Page backgrounds |
| 31 | `31-network-security-background.webp` | Backgrounds | Hero overlay |
| 32 | `32-data-flow-background.webp` | Backgrounds | Section dividers |
| 33-50 | `33-feature-icons-set.webp` | Icons | Navigation / features |
| 51 | `51-social-media-banner.webp` | Marketing | Social headers |
| 52 | `52-hackathon-poster.webp` | Marketing | Print poster |
| 53 | `53-presentation-slide.webp` | Marketing | Pitch deck |

## Recommended Tools
- **Midjourney** — use prompts as-is with `--ar` and `--v 6`
- **DALL-E 3** — simplify prompts slightly
- **Stable Diffusion** — adjust for your model
- **Canva** — combine elements for marketing assets

## Usage in Code
```tsx
// Example: hero background
<img src="/assets/images/01-hero-banner.webp" alt="" className="absolute inset-0 object-cover opacity-30" />

// Example: shield logo
<img src="/assets/images/02-shield-icon.png" alt="PhishGuard AI" className="w-24 h-24" />
```

Until images are generated, the app uses Lucide icons and CSS gradients as placeholders.
