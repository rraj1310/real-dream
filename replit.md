# Real Dream - Goal Tracking Mobile App

## Overview
Real Dream is a comprehensive goal-tracking and dream achievement mobile app built with React Native + Expo. It helps users set, track, and achieve their personal and group goals with gamification elements like coins, awards, leaderboards, and social features.

## Tech Stack
- **Frontend**: React Native + Expo (SDK 54)
- **Backend**: Express.js with TypeScript
- **Authentication**: Firebase Authentication (Email/Password, Google OAuth, Facebook OAuth, Phone OTP)
- **State Management**: React Query (TanStack Query) + ThemeContext
- **Navigation**: React Navigation 7 (stack + bottom tabs)
- **UI Components**: Custom themed components with react-native-reanimated animations
- **Icons**: @expo/vector-icons (Feather icons)
- **Gradients**: expo-linear-gradient for UI elements

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
│   │   └── theme.ts          # Colors, spacing, typography, border radius, themes
│   ├── context/
│   │   └── ThemeContext.tsx  # Theme state management with AsyncStorage
│   ├── hooks/
│   │   ├── useTheme.ts       # Theme hook (wraps ThemeContext)
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
│   │   ├── ChampionsScreen.tsx       # Leaderboard with medal modals
│   │   ├── WallOfFameScreen.tsx      # Top achievers
│   │   ├── MarketScreen.tsx          # Virtual marketplace
│   │   ├── GalleryScreen.tsx         # Dream gallery showcase
│   │   ├── NewsFeedScreen.tsx        # Community news feed
│   │   ├── ProfileScreen.tsx         # User profile
│   │   ├── ThemeScreen.tsx           # Theme selection (free + premium)
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

### Theme System
- **Free Themes**: Light and Dark modes
- **Premium Themes**: Ocean (99 coins), Sunset (99 coins), Forest (149 coins), Lavender (149 coins), Rose (199 coins), Midnight (199 coins)
- Theme persistence with AsyncStorage
- Purchase modal with coin deduction
- Each theme includes unique gradient colors and accent tones

### Authentication
- Sign In / Sign Up screens with animated logo
- Password visibility toggle
- **Social login**: Google and Facebook OAuth (mock implementation for demo)
- **Forgot Password**: Email-based password reset flow with tokens
- Password reset tokens expire after 1 hour
- ForgotPasswordScreen for password recovery
- Navigates to main app after auth

### Real-time Messaging
- MessagesScreen shows list of conversations with unread counts
- ChatScreen for one-on-one messaging between users
- Messages auto-refresh every 5 seconds
- Mark all messages as read functionality
- Messages marked as read when conversation is opened

### Main Menu (Home Tab)
- Welcome message with coin balance display
- 6 menu items in a grid: My RealDream, Social, Champions, Market, Gallery, News Feed
- Color-coded gradient icons for each category

### My RealDream
- Three dream types: Personal, Challenge, Group
- Goal icons grid (stop smoking, new car, travel, etc.)
- Start New RealDream button

### Champions
- Hall of Fame / Wall of Fame links with gradient icons
- Top Champions leaderboard (gold, silver, bronze medals)
- Rising Stars section
- **Interactive medal modals** showing champion stats (Dreams, Points, Awards)

### Wall of Fame
- Period tabs: Monthly, Yearly, All Time
- Legends cards with stats (dreams, achievements, points)
- Hall of Famers list with year badges

### Market
- Available balance display
- Category filter pills (All, Badges, Customization, Boosters, Themes, Stickers)
- Market items with gradient icons and prices

### Gallery
- Dream gallery with community achievements
- Gradient cards with likes and categories
- Beautiful visual showcase

### News Feed
- Community posts with avatars
- Achievement badges on posts
- Like, comment, share interactions

### Profile
- User avatar with gradient background
- Connections and Achievements links
- Theme & Appearance access to ThemeScreen
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

### Theme Colors (Light Mode Default)
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
- LinearGradient icons and avatars
- Pill-shaped primary buttons
- Bottom tab navigation with blur effect
- Interactive modals for champions and purchases

## Running the App

### Development
- Backend: `npm run server:dev` (port 5000)
- Frontend: `npm run expo:dev` (port 8081)

### Testing
- Web: Open http://localhost:8081
- Mobile: Scan QR code with Expo Go app

## Recent Changes
- January 2026: Added comprehensive theme system with 8 themes (2 free + 6 premium)
- Added premium theme purchase functionality with coins
- Enhanced UI with LinearGradient components throughout
- Added interactive medal/trophy modals on Champions screen
- Created Market, Gallery, and NewsFeed screens with real API integration
- Updated navigation to match PDF outline
- Improved visual design with gradient backgrounds and animations
- Added SubscriptionScreen with Bronze ($4.99), Silver ($9.99), Gold ($19.99), and Platinum ($29.99) tiers
- Settings screen now shows real user data and navigates to Subscription
- Market, Gallery, and News Feed screens now fetch real data from the database
- API endpoints enhanced to include user information with posts
- Added OAuth support for Google and Facebook login (mock implementation)
- Added Forgot Password flow with email-based token reset
- Added real-time MessagesScreen with conversation list and unread counts
- Added ChatScreen for one-on-one messaging with auto-refresh
- API routes added for conversations and mark messages as read
- January 2026: Implemented REAL Firebase Authentication replacing mock auth system
- Firebase Email/Password, Google OAuth, Facebook OAuth, and Phone OTP authentication
- Firebase Admin SDK integration on backend for token verification
- Firebase password reset flow using email links (Firebase handles the reset page)
- Database schema updated with firebaseUid field linking users to Firebase accounts
- PhoneSignInScreen with OTP verification and reCAPTCHA support
- All protected API endpoints now verify Firebase ID tokens
- January 2026: Production-Ready Security & Data Enhancements
- Removed ALL hardcoded/mock data from screens - now fully backed by real database
- Wall of Fame fetches real champions data with dream counts from database
- Gallery and News Feed show empty states when no data (no fallback mock data)
- Market seeded with 10 real items (Badges, Customization, Boosters, Themes, Stickers)
- Added POST /api/market/:id/purchase endpoint for real purchases with coin deduction
- Added POST /api/themes/:id/purchase endpoint for theme purchases
- Security: Personal dreams only visible to owner (enforced at API level)
- Security: Dream tasks endpoints verify user has access to parent dream
- Security: Notifications can only be marked read by their owner
- Security: All user-specific endpoints properly filter by authenticated user ID
- Market purchase modal with confirmation and real transaction logging
- January 2026: Dream Creation with Task Auto-Generation
- CreateDreamScreen redesigned with duration, unit (days/weeks/months/years), and recurrence (daily/weekly/semi-weekly/monthly/semi-monthly) dropdowns
- Task auto-generation: System generates calendar-like recurring tasks based on duration and recurrence settings
- Character counters displayed next to field labels (Dream name: 24 max, Description: 60 max)
- "Apply first task to all" functionality - fills in first task, applies to all generated tasks
- Preview of first 10 generated tasks with dates, "+N more tasks..." indicator if more exist
- Robust date calculation handling edge cases (month lengths, leap years, timezone safety, bi-weekly drift prevention)
- Backend validation: duration must be positive integer, start date cannot be in the past
- Database schema updated with duration, durationUnit, and recurrence enum fields on dreams table
