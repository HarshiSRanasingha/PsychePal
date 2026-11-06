# 💜 PsychePal – Starter Project

**Student:** U.G.H.S. Ranasingha  
**Registration Number:** 2022/ICT/78  
**Assessment:** ICA 03 – React Native Application Development

PsychePal is an offline-first starter mobile application for everyday mood tracking, self-reflection, relaxation activities, and psychology education.

## Included in this starter

- React Native + Expo setup
- Bottom-tab and stack navigation
- Home screen with links to feature screens
- Mood check-in saved locally with AsyncStorage
- Mood history screen
- Simple rule-based local chat responses
- Local resource library with search
- Guided thought reflection screen
- Relaxation toolkit
- Recommendations from local JSON files
- Personal diary with local save and delete
- Support directory placeholder
- Reusable UI components and theme

## Requirements

- Node.js (LTS)
- npm
- Expo Go on an Android phone or an Android emulator

## Setup

1. Extract the ZIP folder.
2. Open the `PsychePal_Starter` folder in VS Code.
3. Open a terminal in that folder.
4. Install packages:

   ```bash
   npm install
   ```

5. Start Expo:

   ```bash
   npx expo start
   ```

6. Scan the QR code with Expo Go, or press `a` to open an Android emulator.

If Expo reports a package compatibility issue, run:

```bash
npx expo install --fix
```

## Project structure

```text
PsychePal_Starter/
├── App.js
├── app.json
├── package.json
├── README.md
└── src/
    ├── components/
    ├── data/
    ├── navigation/
    ├── screens/
    └── styles/
```

## Important next development tasks

- Complete the remaining screens and improve navigation.
- Add a proper SQLite database layer for structured records.
- Add create, read, update, and delete operations for diary entries.
- Add persistent storage for reflection notes and goals.
- Expand and verify the original local datasets.
- Add language selection and accessibility improvements.
- Test core functionality with internet disabled.
- Verify every support contact before including it in the final app.

## Data and safety notes

This starter uses local JSON files for sample content and AsyncStorage for basic mood and diary records. It does not use public APIs or online databases.

The chat feature is a small predefined keyword-response demonstration, not generative AI and not a professional counseling service. The support directory contains a placeholder, not a verified helpline. Replace it with verified information before release.

PsychePal is for general education and self-care support. It does not diagnose or treat mental health conditions and does not replace qualified professional or emergency support.
