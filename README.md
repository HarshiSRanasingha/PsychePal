# PsychePal

PsychePal is a React Native wellbeing companion for everyday mood check-ins, private reflection, relaxation, and mental wellness learning. Its warm pastel interface is designed to feel calm and welcoming, and its core features work offline by saving user data on the device.

> PsychePal provides general self-care and educational support. It does not diagnose or treat mental health conditions and is not a replacement for qualified professional care or emergency services.

## Features

- **Home:** Daily encouragement, mood check-in entry points, and shortcuts to the app's tools.
- **Mood check-ins:** Choose a mood, record its intensity and an optional note, and receive a gentle acknowledgement.
- **Mood history:** Review check-ins, filter by time period, date, and emotion, and view an intensity trend and check-in streak.
- **Chat:** An offline, rule-based conversation for supportive everyday prompts. It is not generative AI or counseling.
- **Resources:** Browse and search mental wellness learning materials.
- **Diary and goals:** Create, edit, and delete private journal entries; save daily gratitude and track personal goals.
- **Reflection:** Work through guided self-awareness prompts and keep personal reflection notes.
- **Relaxation:** Follow breathing and grounding exercises or use a short relaxation timer.
- **Recommendations and games:** Browse suggestions and open relevant external searches in a browser or app store.
- **Support directory:** Search locally stored service information and use the listed contact links. Confirm current details with the provider.
- **Profile and preferences:** Personalize the app's local profile settings.
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
    ├── data/         # Local resource and support-directory content
    ├── navigation/   # Tab and stack navigation
    ├── screens/      # App screens
    └── styles/       # Shared theme
```

The updated project proposal is available in [PROJECT_PROPOSAL.md](./PROJECT_PROPOSAL.md).

## Data, privacy, and safety

Mood check-ins, diary entries, gratitude notes, goals, reflections, and profile preferences are stored locally with AsyncStorage. The app does not require an account or a backend for these features. Removing the app or clearing its storage may remove locally saved data.

Opening external recommendations, store searches, or service links requires a compatible app and may use the internet. Support-directory information is provided for discovery, not as a guarantee of availability or a substitute for emergency help. If there is immediate danger, contact local emergency services or go to the nearest hospital.
