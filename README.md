# PhishGuard AI 2.0

AI-powered phishing detection and digital threat protection platform.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Pages

| Route | Screen | Figma Mockup |
|-------|--------|--------------|
| `/` | Home / Hero | Desktop Home |
| `/scanner` | URL Scanner | Desktop Scanner |
| `/analysis` | Threat Analysis | Threat Analysis |
| `/dashboard` | Reports & Analytics | Threat Reports |
| `/qr-scanner` | QR Code Auditor | — |
| `/simulator` | Phishing Simulator | — |
| `/history` | Scan History | — |

## Design System

| Token | Value |
|-------|-------|
| Primary | `#2563eb` |
| Success | `#10b981` |
| Warning | `#f59e0b` |
| Danger | `#ef4444` |
| Background | `#0f172a` |

## Image Assets

See [`public/assets/images/ASSET_GUIDE.md`](public/assets/images/ASSET_GUIDE.md) for all 53 image slots, filenames, and Midjourney/DALL-E prompts.

Generate images with your preferred AI tool, then drop them into `public/assets/images/` using the numbered filenames.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Recharts
- Lucide React (placeholder icons)
