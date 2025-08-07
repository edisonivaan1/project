import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Maximize, MinusCircle, PlusCircle, ArrowLeft } from 'lucide-react';
import Card, { CardHeader, CardBody, CardFooter } from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useAudio } from '../contexts/AudioContext';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isMusicEnabled, 
    isSoundEffectsEnabled, 
    toggleMusic, 
    toggleSoundEffects,
    isUserAuthenticated
  } = useAudio();
  
  interface SettingsState {
    fullscreenMode: boolean;
    textSize: 'small' | 'medium' | 'large';
  }

  const [settings, setSettings] = React.useState<SettingsState>(() => {
    // Load saved configuration from localStorage
    const savedSettings = localStorage.getItem('gameSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      fullscreenMode: false,
      textSize: 'medium' as const,
    };
  });

  // Save configuration when it changes
  useEffect(() => {
    localStorage.setItem('gameSettings', JSON.stringify(settings));
  }, [settings]);
  
  const toggleSetting = (key: keyof SettingsState, value?: any) => {
    setSettings((prev: SettingsState) => ({
      ...prev,
      [key]: value !== undefined ? value : !prev[key],
    }));
  };
  
  const textSizeOptions: Record<'small' | 'medium' | 'large', string> = {
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
  };

  // Apply text configuration
  useEffect(() => {
    document.documentElement.style.fontSize = 
      settings.textSize === 'small' ? '14px' : 
      settings.textSize === 'large' ? '18px' : '16px';
  }, [settings.textSize]);

  // Apply fullscreen configuration
  useEffect(() => {
    if (settings.fullscreenMode) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error('Error attempting fullscreen:', err);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [settings.fullscreenMode]);
  
  return (
    <div className="max-w-2xl mx-auto py-8 animate-fade-in">
      <header className="mb-8 text-center">
        <h1 
          className="text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
          tabIndex={0}
          role="heading"
          aria-level={1}
        >
          SETTINGS
        </h1>
      </header>
      
      <Card>
        <CardHeader>
          <h2 
            className="text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
            tabIndex={0}
            role="heading"
            aria-level={2}
          >
            Game Settings
          </h2>
          <p 
            className="text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
            tabIndex={0}
            role="text"
          >
            Customize your game experience
          </p>
        </CardHeader>
        
        <CardBody className="space-y-6">
          {/* Audio Settings */}
          <div>
            <h3 
              className="text-lg font-bold mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
              tabIndex={0}
              role="heading"
              aria-level={3}
            >
              Audio
            </h3>
            {!isUserAuthenticated && (
              <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                <p className="text-sm">🔐 Audio controls available after login</p>
              </div>
            )}
            <div className={`space-y-4 ${!isUserAuthenticated ? 'opacity-50' : ''}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {!isUserAuthenticated ? (
                    <VolumeX className="h-5 w-5 mr-3 text-gray-400" aria-hidden="true" />
                  ) : isMusicEnabled ? (
                    <Volume2 className="h-5 w-5 mr-3 text-blue-600" aria-hidden="true" />
                  ) : (
                    <VolumeX className="h-5 w-5 mr-3 text-gray-700" aria-hidden="true" />
                  )}
                  <span 
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    tabIndex={0}
                    role="text"
                    aria-label="Background Music setting"
                  >
                    Background Music
                  </span>
                </div>
                <div 
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${isUserAuthenticated && isMusicEnabled ? 'bg-primary' : 'bg-gray-300'} ${!isUserAuthenticated ? 'cursor-not-allowed' : 'cursor-pointer'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded`}
                  onClick={isUserAuthenticated ? toggleMusic : undefined}
                  tabIndex={0}
                  role="button"
                  aria-label={`Background Music is ${isUserAuthenticated && isMusicEnabled ? 'enabled' : 'disabled'}. Click to ${isUserAuthenticated && isMusicEnabled ? 'disable' : 'enable'}`}
                  aria-pressed={isUserAuthenticated && isMusicEnabled}
                >
                  <div 
                    className={`bg-white h-4 w-4 rounded-full shadow-md transform transition-transform ${isUserAuthenticated && isMusicEnabled ? 'translate-x-6' : 'translate-x-0'}`} 
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {!isUserAuthenticated ? (
                    <VolumeX className="h-5 w-5 mr-3 text-gray-400" aria-hidden="true" />
                  ) : isSoundEffectsEnabled ? (
                    <Volume2 className="h-5 w-5 mr-3 text-green-600" aria-hidden="true" />
                  ) : (
                    <VolumeX className="h-5 w-5 mr-3 text-gray-700" aria-hidden="true" />
                  )}
                  <span 
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    tabIndex={0}
                    role="text"
                    aria-label="Question Audio setting"
                  >
                    Question Audio
                  </span>
                </div>
                <div 
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${isUserAuthenticated && isSoundEffectsEnabled ? 'bg-primary' : 'bg-gray-300'} ${!isUserAuthenticated ? 'cursor-not-allowed' : 'cursor-pointer'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded`}
                  onClick={isUserAuthenticated ? toggleSoundEffects : undefined}
                  tabIndex={0}
                  role="button"
                  aria-label={`Question Audio is ${isUserAuthenticated && isSoundEffectsEnabled ? 'enabled' : 'disabled'}. Click to ${isUserAuthenticated && isSoundEffectsEnabled ? 'disable' : 'enable'}`}
                  aria-pressed={isUserAuthenticated && isSoundEffectsEnabled}
                >
                  <div 
                    className={`bg-white h-4 w-4 rounded-full shadow-md transform transition-transform ${isUserAuthenticated && isSoundEffectsEnabled ? 'translate-x-6' : 'translate-x-0'}`} 
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Visual Settings */}
          <div>
            <h3 
              className="text-lg font-bold mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
              tabIndex={0}
              role="heading"
              aria-level={3}
            >
              Visual
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Maximize className="h-5 w-5 mr-3 text-gray-700" aria-hidden="true" />
                  <span 
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    tabIndex={0}
                    role="text"
                    aria-label="Full Screen Mode setting"
                  >
                    Full Screen Mode
                  </span>
                </div>
                <div 
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.fullscreenMode ? 'bg-primary' : 'bg-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded cursor-pointer`}
                  onClick={() => toggleSetting('fullscreenMode')}
                  tabIndex={0}
                  role="button"
                  aria-label={`Full Screen Mode is ${settings.fullscreenMode ? 'enabled' : 'disabled'}. Click to ${settings.fullscreenMode ? 'disable' : 'enable'}`}
                  aria-pressed={settings.fullscreenMode}
                >
                  <div 
                    className={`bg-white h-4 w-4 rounded-full shadow-md transform transition-transform ${settings.fullscreenMode ? 'translate-x-6' : 'translate-x-0'}`} 
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <span 
                    className="mr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    tabIndex={0}
                    role="text"
                    aria-label="Text Size setting"
                  >
                    Text Size
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <button 
                    className="p-2 text-gray-600 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    onClick={() => {
                      const sizes = ['small', 'medium', 'large'] as const;
                      const currentIndex = sizes.indexOf(settings.textSize);
                      const newIndex = Math.max(0, currentIndex - 1);
                      toggleSetting('textSize', sizes[newIndex]);
                    }}
                    disabled={settings.textSize === 'small'}
                    tabIndex={0}
                    aria-label="Decrease text size"
                  >
                    <MinusCircle className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  <div className="flex-1 mx-4">
                    <div className="relative pt-1">
                      <div 
                        className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        tabIndex={0}
                        role="slider"
                        aria-valuenow={settings.textSize === 'small' ? 1 : settings.textSize === 'medium' ? 2 : 3}
                        aria-valuemin={1}
                        aria-valuemax={3}
                        aria-label="Text size slider"
                      >
                        {['small', 'medium', 'large'].map((size) => (
                          <div
                            key={size}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap justify-center ${settings.textSize === size ? 'bg-primary' : 'bg-gray-300'}`}
                            style={{ width: '33.333%' }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-xs px-1 mt-1">
                        <span 
                          className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                          tabIndex={0}
                          role="text"
                          aria-label="Small text size"
                        >
                          Small
                        </span>
                        <span 
                          className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                          tabIndex={0}
                          role="text"
                          aria-label="Medium text size"
                        >
                          Medium
                        </span>
                        <span 
                          className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                          tabIndex={0}
                          role="text"
                          aria-label="Large text size"
                        >
                          Large
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="p-2 text-gray-600 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    onClick={() => {
                      const sizes = ['small', 'medium', 'large'] as const;
                      const currentIndex = sizes.indexOf(settings.textSize);
                      const newIndex = Math.min(sizes.length - 1, currentIndex + 1);
                      toggleSetting('textSize', sizes[newIndex]);
                    }}
                    disabled={settings.textSize === 'large'}
                    tabIndex={0}
                    aria-label="Increase text size"
                  >
                    <PlusCircle className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <div 
                  className="mt-4 p-4 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  tabIndex={0}
                  role="region"
                  aria-label="Text size preview"
                >
                  <p className={`${settings.textSize === 'small' ? 'text-sm' : settings.textSize === 'large' ? 'text-lg' : 'text-base'}`}>
                    This is how your text will look with the {textSizeOptions[settings.textSize]} setting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
        
        <CardFooter className="flex justify-center">
          <Button
            variant="custom"
            icon={<ArrowLeft className="text-white" />}
            onClick={() => navigate('/topics')}
            className="h-[40px] w-[225px] bg-blue-500 hover:bg-blue-600 text-white border-2 border-black"
            tabIndex={0}
            aria-label="Back to topics page"
          >
            Back to topics
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;