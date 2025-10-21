# SafeWatch - Law Enforcement Camera Portal

> AI-powered traffic camera surveillance system for law enforcement and public safety with real-time search capabilities

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

## 🚨 Overview

SafeWatch is a modern web-based traffic camera portal designed for law enforcement and crime watchers. It enables real-time monitoring of traffic cameras across multiple states with AI-powered search capabilities to locate vehicles and persons across the camera network.

### Key Features

- 🎯 **AI-Powered Search** - Upload images or descriptions to search across all cameras
- 📹 **Multi-State Coverage** - Monitor cameras across 7+ US states (expandable)
- ⭐ **Favorites System** - Save frequently watched cameras locally or sync across devices
- 🔔 **Amber Alert Support** - Quickly search for missing persons or vehicles
- 🎵 **Acid Jazz Soundtrack** - Relaxing background music while monitoring
- 🔊 **UI Sound Effects** - Interactive audio feedback for all actions
- 🗺️ **Map View** - Geographic visualization of camera locations
- 👤 **User Accounts** - Optional login to sync favorites across devices
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

---

## 🤖 AI Instructions for GitHub Copilot

### Project Context

This is a React-based traffic camera monitoring portal for law enforcement. The application uses:
- React with hooks for state management
- Tailwind CSS for styling
- Lucide React for icons
- Tone.js for UI sounds
- Mock data structure ready for API integration

### Coding Standards

**Component Style:**
- Use functional components with hooks
- Keep components in single file until needed to split
- Use descriptive variable names (e.g., `selectedCamera`, not `cam`)
- Implement sound feedback for all user interactions via `SoundSystem.click()`, `SoundSystem.select()`, etc.

**State Management:**
- Use `useState` for local state
- Use `localStorage` for persistence (favorites, settings)
- Use `useEffect` for side effects and initialization
- When implementing real API calls, use `async/await` pattern

**Styling:**
- Use Tailwind utility classes only (no custom CSS)
- Dark theme: bg-gray-900, bg-gray-800, bg-gray-700 palette
- Accent colors: blue-600 (primary), red-600 (alerts), green-600 (success)
- Hover states should use slightly lighter shades
- Always add transition-colors for smooth animations

**Data Structure:**
```javascript
// Camera object structure
{
  id: number,
  name: string,
  state: string,
  city: string,
  lat: number,
  lon: number,
  stream: string,
  active: boolean,
  lastSeen: Date | null
}

// Search result structure
{
  cameraId: number,
  timestamp: Date,
  confidence: number, // 0-1
  match: string
}
```

### When Adding Features:

1. **New Camera Sources**: Add to `mockCameras` array with proper structure
2. **AI Integration**: Replace `performAISearch` mock with actual API calls
3. **Video Streaming**: Replace Camera icon placeholders with actual video players (use HLS.js or Video.js)
4. **Map Integration**: Replace map view placeholder with Google Maps or Mapbox
5. **Authentication**: Implement JWT-based auth, store token in localStorage
6. **Real-time Updates**: Use WebSocket for live camera status updates

### Sound System Usage:

Always call appropriate sounds for user actions:
- `SoundSystem.click()` - Button clicks
- `SoundSystem.select()` - Selecting items (cameras, results)
- `SoundSystem.toggle()` - Toggle switches
- `SoundSystem.alert()` - Starting searches/alerts
- `SoundSystem.success()` - Successful operations
- `SoundSystem.error()` - Failed operations
- `SoundSystem.notification()` - New notifications

### API Integration Patterns:

```javascript
// Camera feed API
const fetchCameras = async () => {
  const response = await fetch('/api/cameras');
  return await response.json();
};

// AI Search API
const searchCameras = async (imageData, description) => {
  const formData = new FormData();
  if (imageData) formData.append('image', imageData);
  if (description) formData.append('description', description);
  
  const response = await fetch('/api/search', {
    method: 'POST',
    body: formData
  });
  return await response.json();
};

// Authentication API
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};
```

### Security Considerations:

- Never store sensitive data in localStorage (use httpOnly cookies for tokens)
- Implement CORS properly for API calls
- Validate and sanitize all user inputs
- Use HTTPS for all API communications
- Implement rate limiting on search endpoints
- Add CAPTCHA for public-facing forms

---

## 📋 Tech Stack

- **Frontend Framework:** React 18+
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Audio:** Tone.js
- **Build Tool:** Vite (recommended) or Create React App
- **Deployment:** Netlify
- **Future Backend:** Node.js/Express or Python/FastAPI (for AI integration)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/safewatch.git
cd safewatch
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Install required packages**
```bash
npm install react react-dom lucide-react tone
npm install -D tailwindcss postcss autoprefixer
```

4. **Initialize Tailwind CSS**
```bash
npx tailwindcss init -p
```

5. **Configure Tailwind** (tailwind.config.js)
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

6. **Start development server**
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` (Vite) or `http://localhost:3000` (CRA)

---

## 🌐 Deployment to Netlify

### Option 1: Deploy via Netlify UI

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist` (Vite) or `build` (CRA)
6. Click "Deploy site"

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build your project
npm run build

# Deploy
netlify deploy --prod
```

### Option 3: One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

### Environment Variables (Netlify)

Add these in Netlify Dashboard → Site settings → Environment variables:

```bash
VITE_API_URL=https://your-api-url.com
VITE_MAPS_API_KEY=your_google_maps_key
VITE_AI_API_KEY=your_ai_vision_api_key
```

### Netlify Configuration

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

## 📁 Project Structure

```
safewatch/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Top navigation
│   │   ├── CameraGrid.jsx      # Camera grid view
│   │   ├── CameraCard.jsx      # Individual camera card
│   │   ├── AISearch.jsx        # AI search panel
│   │   ├── MapView.jsx         # Map visualization
│   │   ├── Settings.jsx        # Settings modal
│   │   └── CameraModal.jsx     # Full-screen camera view
│   ├── utils/
│   │   ├── soundSystem.js      # UI sound effects
│   │   ├── api.js              # API calls
│   │   └── helpers.js          # Utility functions
│   ├── hooks/
│   │   ├── useCameras.js       # Camera data hook
│   │   ├── useAuth.js          # Authentication hook
│   │   └── useFavorites.js     # Favorites management
│   ├── App.jsx                 # Main component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── public/
├── netlify.toml                # Netlify config
├── package.json
├── tailwind.config.js
├── vite.config.js              # or craco.config.js
└── README.md
```

---

## 🔧 Configuration

### Adding Camera Feeds

Update the `mockCameras` array in `App.jsx` or create a separate data file:

```javascript
export const cameras = [
  {
    id: 1,
    name: "I-95 Exit 22 North",
    state: "FL",
    city: "Miami",
    lat: 25.7617,
    lon: -80.1918,
    stream: "https://your-stream-url/camera1.m3u8",
    active: true,
    lastSeen: null
  },
  // Add more cameras...
];
```

### Integrating Real Camera Streams

Many DOT (Department of Transportation) websites provide public camera feeds:

- **Florida 511:** https://fl511.com
- **Georgia NaviGAtor:** https://511ga.org
- **Alabama Traffic:** https://algotraffic.com

Example integration with HLS.js:

```javascript
import Hls from 'hls.js';

const VideoPlayer = ({ streamUrl }) => {
  const videoRef = useRef(null);
  
  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);
    }
  }, [streamUrl]);
  
  return <video ref={videoRef} controls autoPlay />;
};
```

---

## 🤖 AI Integration Guide

### Computer Vision APIs

**Option 1: AWS Rekognition**
```javascript
import AWS from 'aws-sdk';

const rekognition = new AWS.Rekognition();

const detectVehicles = async (imageBuffer) => {
  const params = {
    Image: { Bytes: imageBuffer },
    MaxLabels: 10,
    MinConfidence: 80
  };
  
  return await rekognition.detectLabels(params).promise();
};
```

**Option 2: Google Cloud Vision**
```javascript
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

const detectObjects = async (imageBuffer) => {
  const [result] = await client.objectLocalization(imageBuffer);
  return result.localizedObjectAnnotations;
};
```

**Option 3: Custom YOLOv8 Model**
```python
# Python backend example
from ultralytics import YOLO

model = YOLO('yolov8n.pt')
results = model(image_path)

for result in results:
    boxes = result.boxes
    for box in boxes:
        confidence = box.conf[0]
        class_id = box.cls[0]
        # Return to frontend
```

---

## 🎨 Customization

### Changing Colors

Edit Tailwind classes in components:

```javascript
// Primary color (blue-600 → purple-600)
className="bg-blue-600" → className="bg-purple-600"

// Alert color (red-600 → orange-600)
className="bg-red-600" → className="bg-orange-600"
```

### Customizing Sounds

Edit `SoundSystem` in the component:

```javascript
click: async () => {
  await SoundSystem.init();
  SoundSystem.synth.triggerAttackRelease('E5', '0.05'); // Change note
}
```

Or use audio files:
```javascript
const audio = new Audio('/sounds/click.mp3');
audio.play();
```

### Background Music

Replace acid jazz with your own tracks:

```javascript
const musicTracks = [
  '/music/track1.mp3',
  '/music/track2.mp3',
  '/music/track3.mp3'
];

// Implement playlist rotation
```

---

## 📝 API Endpoints (For Backend Development)

### Recommended API Structure

```
GET    /api/cameras              - List all cameras
GET    /api/cameras/:id          - Get specific camera
POST   /api/cameras              - Add new camera (admin)
PUT    /api/cameras/:id          - Update camera (admin)
DELETE /api/cameras/:id          - Remove camera (admin)

POST   /api/search               - AI search (image + description)
GET    /api/search/:id           - Get search results

POST   /api/auth/register        - Create account
POST   /api/auth/login           - User login
GET    /api/auth/me              - Get current user
POST   /api/auth/logout          - User logout

GET    /api/favorites            - Get user favorites
POST   /api/favorites/:cameraId  - Add to favorites
DELETE /api/favorites/:cameraId  - Remove from favorites

POST   /api/alerts               - Create new alert (Amber Alert)
GET    /api/alerts               - List active alerts
GET    /api/alerts/:id           - Get alert details
PUT    /api/alerts/:id           - Update alert status
```

---

## 🔐 Security Best Practices

1. **Authentication**
   - Use JWT tokens with short expiration
   - Implement refresh token mechanism
   - Store tokens in httpOnly cookies (not localStorage)

2. **Rate Limiting**
   - Limit AI search requests (e.g., 10/hour per user)
   - Implement CAPTCHA for public forms
   - Use Redis for rate limit tracking

3. **Data Privacy**
   - Encrypt sensitive data at rest
   - Use HTTPS for all communications
   - Implement GDPR compliance measures
   - Add privacy policy and terms of service

4. **Input Validation**
   - Sanitize all user inputs
   - Validate image uploads (size, type)
   - Prevent SQL injection (use parameterized queries)
   - Implement XSS protection

---

## 🧪 Testing

### Unit Tests (Jest + React Testing Library)

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import CameraCard from './CameraCard';

test('renders camera card with name', () => {
  const camera = {
    id: 1,
    name: 'Test Camera',
    city: 'Miami',
    state: 'FL'
  };
  
  render(<CameraCard camera={camera} />);
  expect(screen.getByText('Test Camera')).toBeInTheDocument();
});

test('clicking favorite button toggles state', () => {
  const onFavorite = jest.fn();
  render(<CameraCard camera={camera} onFavorite={onFavorite} />);
  
  fireEvent.click(screen.getByRole('button', { name: /favorite/i }));
  expect(onFavorite).toHaveBeenCalledWith(camera.id);
});
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow existing code style
- Add comments for complex logic
- Update README if adding new features
- Test thoroughly before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Inspired by TrafficVision.Live
- Icons by [Lucide](https://lucide.dev)
- Audio powered by [Tone.js](https://tonejs.github.io)
- Styling with [Tailwind CSS](https://tailwindcss.com)

---

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub

---

## 🗺️ Roadmap

- [ ] Real-time video streaming integration
- [ ] Advanced AI search with vehicle make/model detection
- [ ] License plate recognition (ALPR)
- [ ] Mobile app (React Native)
- [ ] Multi-camera tracking (follow vehicles across cameras)
- [ ] Historical search (search past footage)
- [ ] Email/SMS alerts for matches
- [ ] Admin dashboard for managing cameras
- [ ] API for third-party integrations
- [ ] Multi-language support

---

## 💡 Tips for Success

1. **Start Small:** Begin with a few cameras in one state, then expand
2. **Use Public Feeds:** Many DOT websites offer public camera access
3. **Test Thoroughly:** Ensure AI search works well before scaling
4. **Optimize Performance:** Use lazy loading for camera grids
5. **Monitor Costs:** AI APIs can be expensive at scale
6. **Legal Compliance:** Ensure you have rights to use camera feeds
7. **User Privacy:** Implement strong data protection measures

---

**Built with ❤️ for public safety and law enforcement**
