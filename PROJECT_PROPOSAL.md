# PsychePal — Project Proposal

**Student:** U.G.H.S. Ranasingha
**Registration number:** 2022/ICT/78
**Assessment:** ICA 03 — React Native Application Development

## 1. Project overview

PsychePal is a mobile wellbeing companion built with React Native and Expo. It gives users a private, approachable place to check in with their mood, write reflections, practice simple relaxation exercises, and explore mental wellness resources. The interface uses soft pastel colors, friendly illustrations, rounded cards, and clear language to make routine self-care feel welcoming rather than clinical.

The application is intended for general wellbeing and education. It does not diagnose, treat, or replace care from qualified mental health professionals.

## 2. Problem and motivation

People may want to pause, notice how they feel, or write down a thought but find it difficult to establish a simple daily routine. Mental wellness tools can also feel impersonal or depend on an account, a network connection, or complicated workflows. PsychePal addresses this by bringing lightweight check-ins, journaling, reflection, and relaxation activities together in one mobile interface, with personal records stored on the user's device.

## 3. Aim and objectives

The aim is to develop a usable, Expo Go-compatible mobile application that supports everyday self-reflection and self-care.

Objectives:

1. Provide a straightforward mood check-in with an optional note and intensity rating.
2. Let users review mood history and identify simple patterns over time.
3. Offer private diary, gratitude, goal-tracking, and guided reflection tools.
4. Include breathing, grounding, and timed relaxation activities.
5. Organize educational resources, recommendations, and support-directory information.
6. Use a consistent, accessible interface with gentle visual design and clear navigation.
7. Keep core personal records on-device and make the app straightforward to launch through Expo Go.

## 4. Intended users

The application is intended for people who want practical, self-directed ways to reflect on their everyday mood and wellbeing. It is not intended for clinical assessment, crisis response, or professional treatment.

## 5. Scope and functionality

### In scope

- Home dashboard with encouragement and shortcuts to app features.
- Mood check-in, intensity rating, optional note, and local history with filters and trend display.
- Offline rule-based chat prompts for general supportive conversation.
- Searchable mental wellness learning resources.
- Personal diary with create, edit, and delete actions; daily gratitude and personal-goal progress.
- Guided reflection prompts and locally saved reflection notes.
- Breathing and grounding exercises, animated breathing guidance, and a relaxation timer.
- Book, music, movie, and game suggestions that can open external search pages or app stores.
- Locally available support-directory entries with contact actions.
- Profile preferences and a cohesive pastel visual design.

### Out of scope

- Diagnosis, therapy, clinical risk assessment, or guaranteed crisis intervention.
- A generative AI counselor or claims that the chat provides professional advice.
- User accounts, cloud synchronization, remote storage, or a clinical records system.
- Guaranteeing that external links or third-party services remain available.

## 6. User experience and design

The main flow begins at the home dashboard and leads to a mood check-in or a self-care tool. Bottom-tab navigation provides access to Home, Mood, Chat, Resources, and Profile; secondary activities are reached through in-app shortcuts. Forms and lists use consistent spacing, rounded surfaces, clear labels, and supportive copy.

The visual direction combines cream backgrounds with lavender, peach, mint, and sky-blue accents. Custom illustrations and Nunito typography provide a softer, journal-like character while retaining readable text and familiar controls.

## 7. Technology and implementation

- **Application:** React Native with Expo
- **Language:** JavaScript
- **Navigation:** React Navigation bottom tabs and native stack
- **Local persistence:** AsyncStorage
- **Typography:** Nunito fonts through Expo font packages
- **Native visual effects:** Expo Linear Gradient and React Native animations
- **Platforms:** Android and iOS via Expo Go; a web preview is also available

Mood, diary, gratitude, goal, reflection, and profile data are kept on-device. The chat uses local predefined rules and does not depend on a remote AI service. Resource and support listings are bundled with the application; opening third-party links may require internet access.

## 8. Quality, privacy, and safety considerations

- Keep the main navigation and common tasks simple and predictable.
- Use labels, accessible button roles, and visible selection states where applicable.
- Validate user-provided values before saving goals and entries.
- Report local storage failures rather than silently presenting a successful save.
- Avoid sending personal records to a server; make clear that local data may be lost if app storage is removed.
- Present mental wellness material as general self-care, not medical advice.
- Encourage users to contact local emergency services or qualified professionals when appropriate; do not imply that the application replaces them.

## 9. Verification

The application is checked by exporting Android, iOS, and web bundles with Expo, validating Expo dependency compatibility, and manually exercising navigation and representative screen flows in the web preview. Device testing with Expo Go should also be performed on the target Android and iOS devices where available.

## 10. Deliverables

- React Native / Expo application source code.
- README with installation and Expo Go startup instructions.
- This project proposal describing the product scope, design, implementation, and safety boundaries.

## 11. Future enhancements

Possible future work includes broader device testing, additional accessibility and localization review, richer offline learning materials, user-controlled data export and deletion, and optional secure synchronization if a clear privacy model is established.
