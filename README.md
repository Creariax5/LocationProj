# LocApp 📍

A personal location tracking mobile application built with React Native that helps you keep track of where you've been.

## Features

- 🗺️ Real-time location tracking
- 📱 Clean and intuitive user interface
- 🎯 Precise coordinate system
- 🔍 Adjustable zoom levels and resolution settings
- 🔐 Unique user ID system for data management
- 🌍 Google Maps integration
- 📱 Cross-platform compatibility (iOS & Android)

## Technologies Used

- React Native
- Google Maps API
- Location Services
- AsyncStorage for local data persistence
- Supabase

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v14 or higher)
- npm or yarn
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)
- Google Maps API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/locapp.git
```

2. Navigate to the project directory:
```bash
cd locapp
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Create a `.env` file in the root directory and add your Google Maps API key:
```
GOOGLE_MAPS_API_KEY=your_api_key_here
```

5. For iOS, install pods:
```bash
cd ios && pod install && cd ..
```

## Running the App

### iOS
```bash
npx react-native run-ios
```

### Android
```bash
npx react-native run-android
```

## Usage

1. Launch the app
2. Allow location permissions when prompted
3. The app will automatically start tracking your location
4. Use the zoom controls to adjust the map view
5. Your unique user ID is displayed at the top for reference

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

Florian DEMARTINI - florian.demartini.dev@gmail.com

Project Link: [https://github.com/yourusername/locapp](https://github.com/yourusername/locapp)

## Acknowledgments

- Google Maps API
- React Native Community

---

Made with ❤️ by [Florian Demartini]
