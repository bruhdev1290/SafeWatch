import React, { useState, useEffect, useRef } from 'react';
import { Camera, Search, Upload, MapPin, Star, Settings, Play, Pause, Volume2, VolumeX, Users, AlertCircle, Eye, Grid3x3, Filter, Clock, Bell } from 'lucide-react';
import * as Tone from 'tone';

// Mock camera data - replace with real API
const mockCameras = [
  { id: 1, name: "I-95 Exit 22 North", state: "FL", city: "Miami", lat: 25.7617, lon: -80.1918, stream: "https://example.com/stream1", active: true, lastSeen: null },
  { id: 2, name: "Highway 1 & Main St", state: "FL", city: "Tampa", lat: 27.9506, lon: -82.4572, stream: "https://example.com/stream2", active: true, lastSeen: null },
  { id: 3, name: "I-10 Mile Marker 145", state: "AL", city: "Mobile", lat: 30.6954, lon: -88.0399, stream: "https://example.com/stream3", active: true, lastSeen: null },
  { id: 4, name: "US-98 Coastal Highway", state: "FL", city: "Destin", lat: 30.3935, lon: -86.4958, stream: "https://example.com/stream4", active: true, lastSeen: null },
  { id: 5, name: "I-75 Northbound Exit 261", state: "FL", city: "Naples", lat: 26.1420, lon: -81.7948, stream: "https://example.com/stream5", active: true, lastSeen: null },
  { id: 6, name: "Route 41 & University", state: "FL", city: "Fort Myers", lat: 26.6406, lon: -81.8723, stream: "https://example.com/stream6", active: true, lastSeen: null },
  { id: 7, name: "I-4 Downtown Connector", state: "FL", city: "Orlando", lat: 28.5383, lon: -81.3792, stream: "https://example.com/stream7", active: true, lastSeen: null },
  { id: 8, name: "A1A Beachside", state: "FL", city: "Fort Lauderdale", lat: 26.1224, lon: -80.1373, stream: "https://example.com/stream8", active: true, lastSeen: null },
];

// UI Sound System
const SoundSystem = {
  synth: null,
  enabled: true,
  
  init: async () => {
    if (!SoundSystem.synth) {
      await Tone.start();
      SoundSystem.synth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.005,
          decay: 0.1,
          sustain: 0.1,
          release: 0.1,
        }
      }).toDestination();
      SoundSystem.synth.volume.value = -10;
    }
  },
  
  click: async () => {
    if (!SoundSystem.enabled) return;
    await SoundSystem.init();
    SoundSystem.synth.triggerAttackRelease('C5', '0.05');
  },
  
  hover: async () => {
    if (!SoundSystem.enabled) return;
    await SoundSystem.init();
    SoundSystem.synth.triggerAttackRelease('E5', '0.03');
  },
  
  select: async () => {
    if (!SoundSystem.enabled) return;
    await SoundSystem.init();
    const now = Tone.now();
    SoundSystem.synth.triggerAttackRelease('C5', '0.1', now);
    SoundSystem.synth.triggerAttackRelease('E5', '0.1', now + 0.05);
  },
  
  alert: async () => {
    if (!SoundSystem.enabled) return;
    await SoundSystem.init();
    const now = Tone.now();
    SoundSystem.synth.triggerAttackRelease('A4', '0.1', now);
    SoundSystem.synth.triggerAttackRelease('A4', '0.1', now + 0.15);
    SoundSystem.synth.triggerAttackRelease('A4', '0.1', now + 0.3);
  },
  
  success: async () => {
    if (!SoundSystem.enabled) return;
    await SoundSystem.init();
    const now = Tone.now();
    SoundSystem.synth.triggerAttackRelease('C5', '0.1', now);
    SoundSystem.synth.triggerAttackRelease('E5', '0.1', now + 0.08);
    SoundSystem.synth.triggerAttackRelease('G5', '0.15', now + 0.16);
  },
  
  toggle: async () => {
    if (!SoundSystem.enabled) return;
    await SoundSystem.init();
    SoundSystem.synth.triggerAttackRelease('G4', '0.08');
  },
  
  notification: async () => {
    if (!SoundSystem.enabled) return;
    await SoundSystem.init();
    const now = Tone.now();
    SoundSystem.synth.triggerAttackRelease('E5', '0.1', now);
    SoundSystem.synth.triggerAttackRelease('C5', '0.15', now + 0.1);
  },
  
  error: async () => {
    if (!SoundSystem.enabled) return;
    await SoundSystem.init();
    const now = Tone.now();
    SoundSystem.synth.triggerAttackRelease('D4', '0.15', now);
    SoundSystem.synth.triggerAttackRelease('C4', '0.2', now + 0.1);
  }
};

const App = () => {
  const [view, setView] = useState('grid');
  const [cameras, setCameras] = useState(mockCameras);
  const [favorites, setFavorites] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [searchImage, setSearchImage] = useState(null);
  const [searchDescription, setSearchDescription] = useState('');
  const [aiSearching, setAiSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uiSoundsEnabled, setUiSoundsEnabled] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    SoundSystem.enabled = uiSoundsEnabled;
  }, [uiSoundsEnabled]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (cameraId) => {
    const newFavorites = favorites.includes(cameraId)
      ? favorites.filter(id => id !== cameraId)
      : [...favorites, cameraId];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    SoundSystem.toggle();
  };

  const toggleMusic = () => {
    if (!musicEnabled) {
      setMusicEnabled(true);
      setMusicPlaying(true);
    } else {
      setMusicPlaying(!musicPlaying);
    }
    SoundSystem.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSearchImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const performAISearch = async () => {
    if (!searchImage && !searchDescription) return;
    
    setAiSearching(true);
    setSearchResults([]);
    SoundSystem.alert();
    
    // Simulate AI search across cameras
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results - in production, this would call your AI vision API
    const mockResults = [
      { cameraId: 2, timestamp: new Date(Date.now() - 300000), confidence: 0.92, match: 'Vehicle match detected' },
      { cameraId: 5, timestamp: new Date(Date.now() - 120000), confidence: 0.87, match: 'Possible match' },
      { cameraId: 7, timestamp: new Date(Date.now() - 30000), confidence: 0.95, match: 'High confidence match' },
    ];
    
    setSearchResults(mockResults);
    setAiSearching(false);
    SoundSystem.success();
  };

  const filteredCameras = cameras.filter(cam => {
    const matchesSearch = cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cam.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = filterState === 'all' || cam.state === filterState;
    return matchesSearch && matchesState;
  });

  const states = [...new Set(cameras.map(cam => cam.state))].sort();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">SafeWatch</h1>
              <p className="text-sm text-gray-400">Law Enforcement Camera Network</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setShowSearch(!showSearch);
                SoundSystem.click();
              }}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
              AI Search
            </button>
            
            <button
              onClick={toggleMusic}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {musicPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                SoundSystem.click();
              }}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => {
                setIsLoggedIn(!isLoggedIn);
                SoundSystem.select();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isLoggedIn ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <Users className="w-4 h-4" />
              {isLoggedIn ? 'Logged In' : 'Sign In'}
            </button>
          </div>
        </div>
      </header>

      {/* AI Search Panel */}
      {showSearch && (
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              AI-Powered Search & Amber Alert System
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Upload Reference Image</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {searchImage ? (
                      <img src={searchImage} alt="Search reference" className="max-h-40 mx-auto rounded" />
                    ) : (
                      <>
                        <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-400">Click to upload vehicle or person image</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={searchDescription}
                  onChange={(e) => setSearchDescription(e.target.value)}
                  placeholder="Enter vehicle description (make, model, color, license plate) or person description..."
                  className="w-full h-40 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
                
                <button
                  onClick={performAISearch}
                  disabled={aiSearching || (!searchImage && !searchDescription)}
                  className="w-full mt-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {aiSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Scanning Cameras...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search All Cameras
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {searchResults.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-yellow-500" />
                  Search Results - {searchResults.length} Matches Found
                </h3>
                <div className="space-y-2">
                  {searchResults.map((result, idx) => {
                    const camera = cameras.find(c => c.id === result.cameraId);
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedCamera(camera);
                          setShowSearch(false);
                          SoundSystem.select();
                        }}
                        className="bg-gray-700 p-4 rounded-lg flex items-center justify-between hover:bg-gray-600 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-red-600 p-2 rounded">
                            <Camera className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{camera.name}</p>
                            <p className="text-sm text-gray-400">{camera.city}, {camera.state}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-green-400 font-medium">
                            <Clock className="w-4 h-4" />
                            {Math.floor((Date.now() - result.timestamp) / 60000)} min ago
                          </div>
                          <p className="text-sm text-gray-400">Confidence: {(result.confidence * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4 flex-wrap">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setView('grid');
                SoundSystem.click();
              }}
              className={`p-2 rounded-lg transition-colors ${
                view === 'grid' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setView('map');
                SoundSystem.click();
              }}
              className={`p-2 rounded-lg transition-colors ${
                view === 'map' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <MapPin className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search cameras by location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All States</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          
          <div className="text-sm text-gray-400">
            {filteredCameras.length} cameras active
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCameras.map(camera => (
                <div
                  key={camera.id}
                  className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedCamera(camera);
                    SoundSystem.select();
                  }}
                >
                  <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                    <Camera className="w-12 h-12 text-gray-600" />
                    <div className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      LIVE
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(camera.id);
                      }}
                      className="absolute top-2 right-2 p-2 bg-gray-800 bg-opacity-75 rounded-full hover:bg-opacity-100 transition-all"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          favorites.includes(camera.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{camera.name}</h3>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {camera.city}, {camera.state}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">Map view with camera locations</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Integrate with mapping service (Google Maps, Mapbox, etc.)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Selected Camera Modal */}
      {selectedCamera && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedCamera(null)}
        >
          <div
            className="bg-gray-800 rounded-lg max-w-4xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
              <Camera className="w-24 h-24 text-gray-600" />
              <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                LIVE FEED
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedCamera.name}</h2>
                  <p className="text-gray-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedCamera.city}, {selectedCamera.state}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCamera(null);
                    SoundSystem.click();
                  }}
                  className="text-gray-400 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(selectedCamera.id)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Star
                    className={`w-4 h-4 ${
                      favorites.includes(selectedCamera.id) ? 'fill-yellow-400 text-yellow-400' : ''
                    }`}
                  />
                  {favorites.includes(selectedCamera.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="bg-gray-800 rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium">UI Sounds</label>
                  <button
                    onClick={() => {
                      setUiSoundsEnabled(!uiSoundsEnabled);
                      if (!uiSoundsEnabled) {
                        SoundSystem.click();
                      }
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      uiSoundsEnabled ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        uiSoundsEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    ></div>
                  </button>
                </div>
                <p className="text-sm text-gray-400">Enable interface sound effects</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium">Acid Jazz Music</label>
                  <button
                    onClick={() => {
                      setMusicEnabled(!musicEnabled);
                      SoundSystem.toggle();
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      musicEnabled ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        musicEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    ></div>
                  </button>
                </div>
                <p className="text-sm text-gray-400">Smooth acid jazz background music</p>
              </div>
              
              {musicEnabled && (
                <div>
                  <label className="font-medium block mb-2">Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
              
              <div>
                <label className="font-medium block mb-2">Account</label>
                <p className="text-sm text-gray-400 mb-3">
                  {isLoggedIn
                    ? 'Your favorites are synced across devices'
                    : 'Sign in to sync favorites across devices'}
                </p>
                <button
                  onClick={() => {
                    setIsLoggedIn(!isLoggedIn);
                    setShowSettings(false);
                    SoundSystem.select();
                  }}
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${
                    isLoggedIn
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoggedIn ? 'Sign Out' : 'Sign In / Create Account'}
                </button>
              </div>
            </div>
            
            <button
              onClick={() => {
                setShowSettings(false);
                SoundSystem.click();
              }}
              className="w-full mt-6 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Music indicator */}
      {musicPlaying && (
        <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-3 shadow-lg">
          <div className="flex gap-1">
            <div className="w-1 bg-blue-500 h-6 animate-pulse"></div>
            <div className="w-1 bg-blue-500 h-4 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 bg-blue-500 h-8 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 bg-blue-500 h-5 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          </div>
          <div>
            <p className="text-sm font-medium">Acid Jazz Mix</p>
            <p className="text-xs text-gray-400">Now Playing</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;