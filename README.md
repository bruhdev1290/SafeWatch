# SafeWatch - Law Enforcement Camera Portal

🚨 SafeWatch is a modern web-based traffic camera portal designed for law enforcement and crime watchers. It enables real-time monitoring of traffic cameras across multiple states with AI-powered search capabilities to locate vehicles and persons across the camera network.

## Key Features

- 🎯 **AI-Powered Search** - Upload images or descriptions to search across all cameras
- 📹 **Multi-State Coverage** - Monitor cameras across 7+ US states (expandable)
- ⭐ **Favorites System** - Save frequently watched cameras locally or sync across devices
- 🔔 **Amber Alert Support** - Quickly search for missing persons or vehicles
- 🎵 **Acid Jazz Soundtrack** - Relaxing background music while monitoring
- 🔊 **UI Sound Effects** - Interactive audio feedback for all actions
- 🗺️ **Map View** - Geographic visualization of camera locations
- 👤 **User Accounts** - Optional login to sync favorites across devices
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- **React** with hooks for state management
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Tone.js** for UI sounds
- **Vite** for fast development and building

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bruhdev1290/CamHub.git
cd CamHub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Linting

```bash
npm run lint
```

## Usage

1. **Browse Cameras**: View all available traffic cameras in grid or map view
2. **Search**: Use the search bar to filter cameras by location
3. **AI Search**: Click "AI Search" to upload images or descriptions for intelligent matching
4. **Favorites**: Star cameras to save them for quick access
5. **Settings**: Toggle UI sounds and background music
6. **Sign In**: Optionally sign in to sync favorites across devices

## Development

### Component Style

- Use functional components with hooks
- Keep components in single file until needed to split
- Use descriptive variable names (e.g., `selectedCamera`, not `cam`)
- Implement sound feedback for all user interactions via `SoundSystem.click()`, `SoundSystem.select()`, etc.

### State Management

- Use `useState` for local state
- Use `localStorage` for persistence (favorites, settings)
- Use `useEffect` for side effects and initialization
- When implementing real API calls, use async/await pattern

### Styling

- Use Tailwind utility classes only (no custom CSS)
- Dark theme: `bg-gray-900`, `bg-gray-800`, `bg-gray-700` palette
- Accent colors: `blue-600` (primary), `red-600` (alerts), `green-600` (success)
- Hover states should use slightly lighter shades
- Always add `transition-colors` for smooth animations

## API Integration

The application currently uses mock data. To integrate with a real API:

1. Replace `mockCameras` in `src/App.tsx` with an API call
2. Implement the AI search backend to analyze camera feeds
3. Add authentication endpoints for user accounts
4. Integrate with a mapping service for the map view

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
