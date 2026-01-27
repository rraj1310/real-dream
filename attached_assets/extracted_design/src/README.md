# Real Dream Mobile App

A comprehensive mobile-first web application for goal setting, dream tracking, and community engagement.

## 🚀 Features

### Authentication
- Sign In / Sign Up
- Forgot Password flow

### Main Features
- **My RealDream**: Personal, Group, and Challenge dreams
- **RealDream Market**: Product marketplace with vendor profiles
- **Champions**: Leaderboards and Hall of Fame
- **Social**: News Feed, Connections, Messages
- **Gallery**: Photo gallery with grid/list views
- **Wallet**: Coins and awards management
- **Lucky Wheel**: Gamification feature
- **Notifications**: Real-time updates
- **Settings**: Account and preferences

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn

### Setup Steps

1. **Install dependencies:**
```bash
npm install
# or
yarn install
```

2. **Run development server:**
```bash
npm run dev
# or
yarn dev
```

3. **Open in browser:**
Navigate to `http://localhost:5173` (or the URL shown in terminal)

## 🏗️ Project Structure

```
/
├── App.tsx                 # Main app entry point
├── routes.ts              # React Router configuration
├── components/
│   ├── auth/             # Authentication screens
│   ├── main/             # Main menu/dashboard
│   ├── profile/          # User and vendor profiles
│   ├── realdream/        # Dream management
│   ├── market/           # Marketplace
│   ├── social/           # Social features
│   ├── wallet/           # Wallet and transactions
│   ├── champions/        # Leaderboards
│   ├── gallery/          # Photo gallery
│   ├── games/            # Lucky wheel
│   ├── notifications/    # Notifications
│   ├── messages/         # Messaging
│   ├── settings/         # Settings
│   └── common/           # Reusable components
│       ├── AppHeader.tsx
│       ├── BottomNav.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Input.tsx
└── styles/
    └── globals.css       # Global styles
```

## 🎨 Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons

## 🎯 Key Components

### Reusable Components
- `AppHeader` - Top navigation with back button, notifications, settings
- `BottomNav` - Bottom navigation bar (Home, Market, Social, Wallet, Profile)
- `Button` - Styled button with variants (primary, secondary, outline, ghost)
- `Card` - Content container with optional click handler
- `Input` - Form input with label and error states

## 🔄 Navigation Flow

```
Sign In → Main Menu → [All Features]
         ↓
    Bottom Navigation
    ├── Home (Main Menu)
    ├── Market (RealDream Market)
    ├── Social (News Feed)
    ├── Wallet
    └── Profile (Personal Profile)
```

## 📱 Mobile-First Design

- Optimized for mobile viewports (375px - 428px)
- Responsive layout that adapts to larger screens
- Touch-friendly UI elements
- Bottom navigation for easy thumb access

## 🎨 Design System

### Colors
- Primary: Blue (#2563eb)
- Secondary: Purple (#9333ea)
- Success: Green (#16a34a)
- Warning: Yellow (#eab308)
- Error: Red (#dc2626)

### Typography
- Font Family: System fonts (Inter fallback)
- Responsive sizing based on Tailwind defaults

### Components
- Rounded corners (8px - 16px)
- Consistent spacing (4px grid)
- Smooth transitions
- Gradient avatars and badges

## 🚀 Deployment

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
```bash
npm run build
# Upload 'dist' folder to Netlify
```

### Option 3: GitHub Pages
```bash
npm run build
# Deploy 'dist' folder
```

## 🔧 Customization

### Adding New Screens
1. Create component in appropriate folder under `/components`
2. Add route in `/routes.ts`
3. Add navigation link where needed

### Styling
- Modify `/styles/globals.css` for global styles
- Use Tailwind utility classes for component styling
- Customize colors in globals.css CSS variables

## 📄 License

This project was created with Figma Make.

## 🤝 Contributing

Feel free to customize and extend this application for your needs!

## 📞 Support

For questions or issues, refer to the component documentation in the code comments.

---

**Built with ❤️ using Figma Make**
