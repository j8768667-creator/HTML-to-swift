# HTML to Swift Playgrounds Converter

Convert HTML and CSS markup into modern SwiftUI code ready for **Apple Swift Playgrounds 4** on iPadOS & macOS.

## Features

- **Instant Offline Compiler**: Converts HTML/CSS structures (flexbox, grid, typography, cards, buttons, inputs, toggles) directly into native SwiftUI (`VStack`, `HStack`, `ZStack`, `Button`, `TextField`, `Toggle`, etc.) client-side with 0ms latency.
- **Apple Swift Playgrounds 4 Compatibility**: Ready to paste into `ContentView.swift` or run as a standalone `.swift` app file.
- **Live Canvas Simulator**: Interactive preview toggle between iPhone 16 Pro and iPad Air/Pro canvas with dark/light mode testing.
- **Export & Copy**: Instant one-click copy and download of compiled `.swift` source code.
- **Gemini AI Refinement**: Optional AI-assisted optimization for complex animations, layouts, and gesture recognizers.

## Quick Start (Local Development)

Clone the repository and install dependencies:

```bash
npm install
npm run dev
```

The application will be running at `http://localhost:3000`.

## Building for Production

To compile both the Vite client application and the Node server:

```bash
npm run build
npm start
```

To build only the client-side static assets (for static hosting or GitHub Pages):

```bash
npx vite build
```

## GitHub Pages Deployment

This repository includes a GitHub Action workflow in `.github/workflows/deploy.yml`.

To deploy to GitHub Pages:
1. Push this repository to GitHub.
2. Go to **Settings** → **Pages** in your GitHub repository.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. The workflow will automatically build and publish the app to `https://<username>.github.io/<repository-name>/`.
