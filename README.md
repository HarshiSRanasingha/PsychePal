# PsychePal

**A gentle space for everyday mental wellbeing.**

PsychePal is an offline-first wellbeing companion built with React Native and Expo. It brings mood check-ins, reflection, self-care tools, and educational resources together in a calm, approachable interface.

> **Important:** PsychePal is for general education and self-care. It does not diagnose or treat mental health conditions and is not a substitute for professional care or emergency services. If you are in immediate danger, contact local emergency services or go to the nearest hospital.

## Explore the app
demo video link : https://drive.google.com/file/d/1h9L6iSRO53t6Y8wEjzyLcq323O5tWnMd/view?usp=sharing

| Area | What you can do |
| --- | --- |
| **Home** | Find daily encouragement, a thought for today, and shortcuts to your wellbeing tools. |
| **Mood** | Record a feeling, its intensity, an optional note, and the date and time. Explore mood history, trends, filters, and streaks. |
| **Chat** | Use an offline, rule-based companion for supportive everyday prompts. It is not generative AI, therapy, or a crisis service. |
| **Reflection** | Explore guided prompts, reflect on your thoughts, and save personal notes. |
| **Diary and goals** | Write and manage diary entries, record gratitude, and track personal goals. |
| **Relaxation** | Try 10 breathing, grounding, and other gentle exercises, along with a relaxation timer. |
| **Resources** | Choose English, Sinhala, or Tamil and browse 10 topics with five readings per topic. Explicitly mark readings as read to save progress for your local profile. English includes expanded guides and additional existing resources; Sinhala and Tamil currently have shorter notes. |
| **Recommendations** | Explore colorful suggestions by language and category, including books, music, and other activities. External searches and links may require internet access. |
| **Counselling** | Browse a small directory of real Sri Lankan organizations by category and language, with source links and verification dates. Providers whose languages have not been confirmed are shown separately. |
| **Profile and settings** | Personalize your experience with one of 30 companion avatars, manage preferences and local data, and sign out. |

## Technology

| Technology | Purpose |
| --- | --- |
| React Native, React, Expo | Cross-platform application and development tooling |
| React Navigation | Stack and bottom-tab navigation |
| Expo SQLite | Local accounts and profile-specific records; WebAssembly-backed SQLite on web |
| AsyncStorage | Device-local settings and onboarding preferences |
| Expo Crypto and `@noble/hashes` | Random salts and PBKDF2-SHA256 password hashing |
| Expo Linear Gradient and Nunito | Visual styling and typography |
| Node.js test runner | Automated tests for app data and behavior |

Dependency versions and scripts are defined in [`PsychePal/package.json`](PsychePal/package.json).

## Getting started

### Prerequisites

- Node.js LTS and npm.
- For a phone: a compatible Expo Go installation and a network connection to the development server. SDK compatibility may require a development build instead.
- For an emulator or simulator: the corresponding Android or Apple development tools. The iOS simulator requires macOS.

### Install and run

From the repository root:

```sh
cd PsychePal
npm install
npm start
```

Open the displayed link or scan the QR code with a compatible Expo Go app. Other available commands, run from the app directory:

```sh
npm run android
npm run ios
npm run web
```

The Android and iOS commands use an available emulator or simulator. Web starts the browser version.

### Run tests and build for web

From the app directory:

```sh
node --test
npx expo export --platform web
```

On Windows PowerShell, if execution policy blocks `npx.ps1`, use `npx.cmd expo export --platform web` instead.

The web build uses SQLite WebAssembly. A hosting server must serve the WebAssembly assets and send these headers for the app document:

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: credentialless
```

The development configuration is in [`PsychePal/metro.config.js`](PsychePal/metro.config.js). External resources must also be compatible with the hosting policy.

## Project structure

```text
PsychePal/
├── README.md
└── PsychePal/
    ├── App.js             # App entry point and navigation
    ├── app.json           # Expo configuration
    ├── package.json       # Scripts and dependencies
    ├── metro.config.js    # Bundler and web configuration
    ├── src/
    │   ├── components/    # Shared interface components
    │   ├── context/       # Application context
    │   ├── data/          # Local storage, content, and service directory
    │   ├── i18n/          # Localization
    │   ├── screens/       # Application screens
    │   └── styles/        # Shared theme
    └── tests/             # Node.js tests
```

## Data and privacy

- Accounts and wellbeing records are stored locally, not synchronized between devices. The first local profile can import records from the earlier AsyncStorage format.
- Passwords are stored as salted PBKDF2-SHA256 hashes, but **the database and personal records are not encrypted**. Local sign-in does not protect data from someone with access to the device or its files.
- There is no password recovery or reset. Use a device screen lock and back up data before removing the app or clearing its storage.
- Reading progress belongs to the active local profile. Marking a reading as read is an explicit action.
- Core local features work offline after the app is available on the device. Provider links, external recommendations, app-store searches, and development setup may require connectivity.

## Content and service limitations

- Reading content is general educational information, not medical advice. Sinhala and Tamil translations have **not** been professionally reviewed; their readings are shorter than the English guides.
- The counselling directory lists organizations, not guaranteed appointments or individual counsellors. Availability, fees, services, and language coverage can change; confirm details directly with the provider using the linked source.
- Recommendation language information may be unspecified where it has not been confirmed.
- Native Android and iOS device testing and independent clinical/content review remain important before treating the app as production-ready.

## Future improvements

- Expand and professionally review Sinhala and Tamil readings and translations, alongside clinical review of educational content.
- Regularly verify service listings and expand the directory using reliable, clearly attributed sources.
- Test accessibility, usability, and app behavior across physical Android and iOS devices.
- Explore encrypted storage, secure recovery, and user-controlled backup or synchronization while preserving privacy.
- Continue improving personalization, inclusive language support, and offline self-care tools.
