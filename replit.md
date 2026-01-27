# Real Dream - Goal Tracking Mobile App

## Overview
Real Dream is a comprehensive goal-tracking and dream achievement mobile app built with React Native + Expo. It helps users set, track, and achieve their personal and group goals with gamification elements like coins, awards, leaderboards, and social features.

## Tech Stack
- **Frontend**: React Native + Expo (SDK 54)
- **Backend**: Express.js with TypeScript
- **State Management**: React Query (TanStack Query)
- **Navigation**: React Navigation 7 (stack + bottom tabs)
- **UI Components**: Custom themed components with react-native-reanimated animations
- **Icons**: @expo/vector-icons (Feather icons)

## Project Structure

```
├── client/                    # React Native Expo frontend
│   ├── components/           # Reusable UI components
│   │   ├── Button.tsx        # Animated button with press feedback
│   │   ├── Card.tsx          # Card container with press animation
│   │   ├── Input.tsx         # Themed input field
│   │   ├── ThemedText.tsx    # Typography component
│   │   ├── ThemedView.tsx    # Themed container
│   │   ├── HeaderTitle.tsx   # Custom header with app icon
│   │   └── ...
│   ├── constants/
│   │   └── theme.ts          # Colors, spacing, typography, border radius
│   ├── hooks/
│   │   ├── useTheme.ts       # Theme/dark mode hook
│   │   └── useScreenOptions.ts # Navigation header options
│   ├── navigation/
│   │   ├── RootStackNavigator.tsx    # Auth + main tabs
│   │   ├── MainTabNavigator.tsx      # 4-tab bottom navigation
│   │   ├── HomeStackNavigator.tsx    # Home tab screens
│   │   ├── RealDreamStackNavigator.tsx
│   │   ├── ProfileStackNavigator.tsx
│   │   └── SettingsStackNavigator.tsx
│   ├── screens/
│   │   ├── SignInScreen.tsx          # Login screen
│   │   ├── SignUpScreen.tsx          # Registration screen
│   │   ├── MainMenuScreen.tsx        # Home with menu grid
│   │   ├── MyRealDreamScreen.tsx     # Goals/dreams screen
│   │   ├── ChampionsScreen.tsx       # Leaderboard
│   │   ├── WallOfFameScreen.tsx      # Top achievers
│   │   ├── ProfileScreen.tsx         # User profile
│   │   ├── SettingsScreen.tsx        # App settings
│   │   └── WalletScreen.tsx          # Coins/awards wallet
│   └── lib/
│       └── query-client.ts   # React Query setup
├── server/                    # Express.js backend
│   ├── index.ts              # Server entry point
│   └── routes.ts             # API routes
├── assets/
│   └── images/               # App icons, splash screen
├── design_guidelines.md      # Complete design system documentation
└── app.json                  # Expo configuration
```

## Key Features

### Authentication
- Sign In / Sign Up screens with animated logo
- Password visibility toggle
- Navigates to main app after auth

### Main Menu (Home Tab)
- Welcome message
- 6 menu items in a grid: My RealDream, Social, Champions, Market, Gallery, News Feed
- Color-coded icons for each category

### My RealDream
- Three dream types: Personal, Challenge, Group
- Goal icons grid (stop smoking, new car, travel, etc.)
- Start New RealDream button

### Champions
- Hall of Fame / Wall of Fame links
- Top Champions leaderboard (gold, silver, bronze)
- Rising Stars section

### Wall of Fame
- Period tabs: Monthly, Yearly, All Time
- Legends cards with stats (dreams, achievements, points)
- Hall of Famers list with year badges

### Profile
- User avatar with gradient background
- Connections and Achievements links
- My Orders section (Purchase, Wallet)
- Account actions (Edit, Delete)

### Wallet
- Coin balance display
- Add/Send/Withdraw actions
- Coins/Awards toggle tabs
- Transaction history
- Award badges collection

### Settings
- User info display
- Navigation to Profile, Vendor Profile, Subscription, Notifications

## Design System

### Colors
- **Primary Blue**: #3B82F6
- **Purple**: #8B5CF6 (secondary accent)
- **Yellow/Gold**: #EAB308 (achievements)
- **Green**: #22C55E (success)
- **Background**: #F9FAFB (light), #111827 (dark)

### Spacing
- xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 20px, 2xl: 24px, 3xl: 32px

### Border Radius
- xs: 8px, sm: 12px, md: 16px, full: 9999px (circular)

### Components
- Cards with press animation (scale 0.98)
- Pill-shaped primary buttons
- Gradient avatars (blue to purple)
- Bottom tab navigation with blur effect

## Running the App

### Development
- Backend: `npm run server:dev` (port 5000)
- Frontend: `npm run expo:dev` (port 8081)

### Testing
- Web: Open http://localhost:8081
- Mobile: Scan QR code with Expo Go app

## Recent Changes
- January 2026: Complete redesign based on Figma export
- Implemented all core screens from design
- Added animated components with haptic feedback
- Set up proper navigation structure
- Created comprehensive design guidelines
