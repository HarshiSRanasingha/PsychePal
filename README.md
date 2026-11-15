# PsychePal

PsychePal is a React Native wellbeing companion for everyday mood check-ins, private reflection, relaxation, and mental wellness learning. Its warm pastel interface is designed to feel calm and welcoming, and its core features work offline by saving user data on the device.

> PsychePal provides general self-care and educational support. It does not diagnose or treat mental health conditions and is not a replacement for qualified professional care or emergency services.

## Features

- **Home:** Daily encouragement, mood check-in entry points, and shortcuts to the app's tools.
- **Mood check-ins:** Choose a mood, record its intensity and an optional note, and receive a gentle acknowledgement.
- **Mood history:** Review check-ins, filter by time period, date, and emotion, and view an intensity trend and check-in streak.
- **Chat:** An offline, rule-based conversation for supportive everyday prompts. It is not generative AI or counseling.
- **Resources:** Choose English, Sinhala, or Tamil and explore 10 categories with five short reads each. Mark articles as read to save progress for the current local profile; the earlier English resources remain available under More reading.
- **Diary and goals:** Create, edit, and delete private journal entries; save daily gratitude and track personal goals.
- **Reflection:** Work through guided self-awareness prompts and keep personal reflection notes.
- **Relaxation:** Choose from 10 breathing, grounding, and other gentle exercises, or use a relaxation timer.
- **Recommendations and games:** Browse colorful suggestions by language and category, and open relevant external searches in a browser or app store. Items without verified language information are labeled as not specified.
- **Support directory:** Search locally stored service information and use the listed contact links. Confirm current details with the provider.
- **Profile and preferences:** Choose from 30 companion avatars, personalize local settings, and sign out to return to the login screen.
- **Local accounts:** Create multiple on-device profiles and sign in without an internet connection.
- **Offline database:** Keep mood, reflection, diary, gratitude, goal, and profile records in a SQLite database, separated by local profile.
- **Cozy interface:** Pastel gradients, rounded cards, custom illustrations, and Nunito typography.

## Run with Expo Go

### Requirements

- Node.js LTS and npm
- Expo Go installed on an Android or iOS device
- A computer and phone on the same local network (or a suitable Expo tunnel connection)

### Start the app

From the repository root:

```bash
cd PsychePal
npm install
npm start
```

Scan the displayed QR code with Expo Go (on iOS, use the Camera app to open the Expo Go link). If the device cannot connect over the local network, start Expo with tunnel mode:

```bash
npx expo start --tunnel
```

The project also provides these scripts:

```bash
npm run android
npm run ios
npm run web
```

The `android` and `ios` scripts open a native emulator/simulator when one is installed. `web` starts the browser version. The app is configured to launch in Expo Go with `npm start`.

## App structure

```text
PsychePal/
├── App.js
├── app.json
├── package.json
└── src/
    ├── components/   # Shared UI, illustrations, buttons, and screen backgrounds
    ├── data/         # SQLite account/data storage and local resource content
    ├── navigation/   # Tab and stack navigation
    ├── screens/      # App screens
    └── styles/       # Shared theme
```

## Data, privacy, and safety

Mood check-ins, diary entries, gratitude notes, goals, reflections, reading progress, and profile preferences are stored in the local SQLite database. The first local profile created imports any existing records from the previous AsyncStorage format. Local accounts are device-only: they do not sync, and passwords cannot be recovered or reset. Passwords are stored as salted hashes, but the SQLite database and personal records are not encrypted; local sign-in is not a security boundary against someone with access to the device or its files. Use the device's screen lock and back up data before removing the app or clearing its storage.

The short reading guides are general educational material, not medical advice. Their Sinhala and Tamil translations have not been professionally reviewed.

The web build uses SQLite's WebAssembly implementation. Its hosting server must support WebAssembly and send `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: credentialless` headers for the app document.

Opening external recommendations, store searches, or service links requires a compatible app and may use the internet. Support-directory information is provided for discovery, not as a guarantee of availability or a substitute for emergency help. If there is immediate danger, contact local emergency services or go to the nearest hospital.
