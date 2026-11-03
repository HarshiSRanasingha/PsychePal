# 💜 PsychePal
### Your Personal Assistant for Mind Care, Self-Discovery, and Psychology-Based Guidance

![React Native](https://img.shields.io/badge/React%20Native-Mobile%20App-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Expo](https://img.shields.io/badge/Expo-Framework-black)
![Status](https://img.shields.io/badge/Status-In%20Development-orange)

## 📌 Project Information

| Detail | Information |
|---|---|
| Project Name | PsychePal |
| Student Name | U.G.H.S. Ranasingha |
| Registration Number | 2022/ICT/78 |
| Assessment | ICA 03 |
| Project Type | Individual Mobile Application |
| Framework | React Native |
| Development Environment | Expo |

---

## 🌸 1. Introduction

PsychePal is a mobile application designed to support everyday emotional well-being, self-awareness, relaxation, and personal growth.

The application provides a friendly digital environment where users can track their moods, reflect on their thoughts, practise relaxation exercises, explore psychology-related educational resources, and maintain personal diary entries.

It is especially designed with university students and IT professionals in mind, while remaining useful to anyone interested in personal well-being.

The application focuses on accessibility, simplicity, and offline functionality through locally stored datasets and user information.

## 🎯 2. Problem Statement

Students and working individuals may experience academic pressure, workplace stress, emotional exhaustion, low motivation, and difficulties managing everyday challenges.

However, useful self-care resources and emotional reflection tools are often distributed across different platforms.

PsychePal aims to bring basic mood tracking, guided self-reflection, relaxation activities, and psychology-related resources together in one mobile application.

## 💡 3. Proposed Solution

PsychePal provides an offline-capable mobile application with interactive tools that help users:

- Understand and record their emotions.
- Reflect on thoughts and experiences.
- Practise simple relaxation techniques.
- Explore psychology-related educational content.
- Maintain personal journals.
- Track personal goals and positive experiences.
- Discover useful books, movies, and music.

The core application features will use local datasets and local storage rather than public APIs or online databases.

---

## ✨ 4. Main Features

### 😊 Mood & Emotion Tracker
- Select daily moods and emotions.
- Record emotion intensity.
- Add descriptions or personal notes.
- View previous mood records.
- Review mood history.

### 💬 PsychePal – Personal Support Assistant
- Predefined rule-based conversations.
- Friendly and supportive responses.
- Guided reflective questions.
- General self-care suggestions.
- Locally stored response dataset.

### 🧠 Self-Discovery & Reflection
- Self-discovery questions.
- Explore personal strengths and values.
- Guided thought reflection.
- Emotional awareness activities.

### 🌿 Relaxation Toolkit
- 4-7-8 breathing exercise.
- Box breathing.
- 5-4-3-2-1 grounding technique.
- Mindfulness activities.
- Relaxation guidance.

### 📚 Psychology Resource Library
- Psychology-related educational resources.
- Self-care information.
- Personal development content.
- Search and filter functionality.

### 🎵 Music, 🎬 Movies & 📖 Books
- Curated recommendations.
- Categories based on interests and mood.
- Language-based filtering.
- Locally stored recommendation information.

*External media links may require an internet connection.*

### 📔 Personal Diary
- Create diary entries.
- View saved entries.
- Edit existing entries.
- Delete entries.
- Store personal reflections locally.

### 🌱 Personal Growth Tracker
- Set personal goals.
- Record achievements.
- Maintain gratitude notes.
- Monitor personal progress.

### ☎️ Counselor & Support Directory
- Display relevant support information.
- Provide contact details.
- Organize resources by language.

---

## 🛠️ 5. Technologies Used

| Technology | Purpose |
|---|---|
| React Native | Mobile application development |
| JavaScript | Application programming |
| Expo | Development environment |
| React Navigation | Screen navigation |
| SQLite | Local database |
| AsyncStorage | Local application preferences |
| StyleSheet | User interface styling |
| Git | Version control |
| GitHub | Source code hosting |
| Visual Studio Code | Code editor |

---

## 📱 6. Application Screens

The proposed application will contain the following screens:

1. Splash Screen
2. Welcome Screen
3. Home Screen
4. Mood Check-in
5. Mood History
6. PsychePal Chat
7. Self-Discovery & Reflection
8. Relaxation Toolkit
9. Psychology Resource Library
10. Recommendations
11. Personal Diary & Growth
12. Counselor & Support Directory
13. Profile & Settings

---

## 🗂️ 7. Proposed Project Structure

PsychePal/
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── src/
│   ├── components/
│   │   ├── CustomButton.js
│   │   ├── MoodCard.js
│   │   └── ResourceCard.js
│   │
│   ├── screens/
│   │   ├── SplashScreen.js
│   │   ├── WelcomeScreen.js
│   │   ├── HomeScreen.js
│   │   ├── MoodCheckInScreen.js
│   │   ├── MoodHistoryScreen.js
│   │   ├── ChatScreen.js
│   │   ├── SelfDiscoveryScreen.js
│   │   ├── RelaxationScreen.js
│   │   ├── ResourceLibraryScreen.js
│   │   ├── RecommendationsScreen.js
│   │   ├── DiaryScreen.js
│   │   ├── SupportScreen.js
│   │   └── SettingsScreen.js
│   │
│   ├── navigation/
│   │   └── AppNavigator.js
│   │
│   ├── database/
│   │   ├── database.js
│   │   └── databaseOperations.js
│   │
│   ├── data/
│   │   ├── moods.json
│   │   ├── chatbotResponses.json
│   │   ├── psychologyResources.json
│   │   ├── exercises.json
│   │   ├── music.json
│   │   ├── movies.json
│   │   ├── books.json
│   │   └── supportContacts.json
│   │
│   └── styles/
│       └── theme.js
│
├── App.js
├── package.json
└── README.md
*This is the proposed structure and may be adjusted during development.*

---

## ⚙️ 8. Installation and Setup

### Prerequisites

Install the following tools:

- Node.js
- Visual Studio Code
- Expo development environment
- Android Emulator or Expo Go

### Step 1: Clone the Repository

git clone YOUR_GITHUB_REPOSITORY_URL
### Step 2: Navigate to the Project

cd PsychePal
### Step 3: Install Dependencies

npm install
### Step 4: Start the Application

npx expo start
Follow the Expo instructions to run the application on an Android emulator or a compatible device.

---

## 💾 9. Data Management

PsychePal will use locally stored datasets and a local database.

### Static Datasets

JSON files will store information such as:

- Mood categories.
- Psychology resources.
- Chatbot responses.
- Self-discovery questions.
- Relaxation exercises.
- Music recommendations.
- Movie recommendations.
- Book recommendations.
- Support contact information.

### User Data

SQLite and/or AsyncStorage will be used to store appropriate user-generated information, including:

- Mood records.
- Diary entries.
- Personal goals.
- Gratitude records.
- Application preferences.

The application will retrieve and display locally stored information dynamically.

---

## 🔍 10. Key Application Requirements

- Suitable screen navigation.
- At least five application screens.
- Original locally maintained datasets.
- Local data storage and retrieval.
- Dynamic information display.
- Search and filtering functionality.
- Offline availability of core features.
- Individual GitHub repository.
- Regular Git commits and pushes.

---

## 🔐 11. Privacy & Safety

PsychePal is an educational and self-care support application.

- Personal diary and mood information will be stored locally.
- The application will not provide clinical psychological diagnoses.
- The rule-based assistant does not replace a qualified counselor or mental health professional.
- Users experiencing serious emotional difficulties should seek appropriate professional or emergency support.

---

## 🚀 12. Future Improvements

Possible future developments include:

- AI-powered conversational support.
- Advanced mood analytics.
- More personalized recommendations.
- Additional language support.
- Secure cloud synchronization.
- User authentication.
- Professional counselor appointment management.

These are future possibilities and are not part of the initial ICA 03 implementation scope.

---

## 👩‍💻 13. Developer

U.G.H.S. Ranasingha

Registration Number: 2022/ICT/78

Individual Mobile Application Development Project – ICA 03

---

## 📄 14. Disclaimer

PsychePal is designed for general emotional self-awareness, educational purposes, and everyday self-care support. It is not a medical application and does not provide professional diagnosis, treatment, or emergency services.

---

<p align="center">
  💜 <b>PsychePal – Understand Yourself. Care for Yourself. Grow Every Day.</b>
</p>
`

GitHub tip: Add this `README.md` to the root of your repository, alongside `App.js` and `package.json`. Update the repository URL in the installation section once you create your GitHub repository.




