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
    // Cargar configuración guardada del localStorage
    const savedSettings = localStorage.getItem('gameSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      fullscreenMode: false,
      textSize: 'medium' as const,
    };
  });

  // Guardar configuración cuando cambie
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

  // Aplicar configuración de texto
  useEffect(() => {
    document.documentElement.style.fontSize = 
      settings.textSize === 'small' ? '14px' : 
      settings.textSize === 'large' ? '18px' : '16px';
  }, [settings.textSize]);

  // Aplicar configuración de pantalla completa
  useEffect(() => {
    if (settings.fullscreenMode) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error('Error al intentar pantalla completa:', err);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [settings.fullscreenMode]);
  
  return (
    <div className="max-w-2xl mx-auto py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-center">SETTINGS</h1>
      
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Game Settings</h2>
          <p className="text-gray-600 text-sm">Customize your game experience</p>
        </CardHeader>
        
        <CardBody className="space-y-6">
          {/* Audio Settings */}
          <div>
            <h3 className="text-lg font-bold mb-4">Audio</h3>
            {!isUserAuthenticated && (
              <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                <p className="text-sm">🔐 Audio controls available after login</p>
              </div>
            )}
            <div className={`space-y-4 ${!isUserAuthenticated ? 'opacity-50' : ''}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {!isUserAuthenticated ? (
                    <VolumeX className="h-5 w-5 mr-3 text-gray-400" />
                  ) : isMusicEnabled ? (
                    <Volume2 className="h-5 w-5 mr-3 text-blue-600" />
                  ) : (
                    <VolumeX className="h-5 w-5 mr-3 text-gray-700" />
                  )}
                  <span>Background Music</span>
                </div>
                <div 
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${isUserAuthenticated && isMusicEnabled ? 'bg-primary' : 'bg-gray-300'} ${!isUserAuthenticated ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={isUserAuthenticated ? toggleMusic : undefined}
                >
                  <div 
                    className={`bg-white h-4 w-4 rounded-full shadow-md transform transition-transform ${isUserAuthenticated && isMusicEnabled ? 'translate-x-6' : 'translate-x-0'}`} 
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {!isUserAuthenticated ? (
                    <VolumeX className="h-5 w-5 mr-3 text-gray-400" />
                  ) : isSoundEffectsEnabled ? (
                    <Volume2 className="h-5 w-5 mr-3 text-green-600" />
                  ) : (
                    <VolumeX className="h-5 w-5 mr-3 text-gray-700" />
                  )}
                  <span>Question Audio</span>
                </div>
                <div 
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${isUserAuthenticated && isSoundEffectsEnabled ? 'bg-primary' : 'bg-gray-300'} ${!isUserAuthenticated ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={isUserAuthenticated ? toggleSoundEffects : undefined}
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
            <h3 className="text-lg font-bold mb-4">Visual</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Maximize className="h-5 w-5 mr-3 text-gray-700" />
                  <span>Full Screen Mode</span>
                </div>
                <div 
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.fullscreenMode ? 'bg-primary' : 'bg-gray-300'}`}
                  onClick={() => toggleSetting('fullscreenMode')}
                >
                  <div 
                    className={`bg-white h-4 w-4 rounded-full shadow-md transform transition-transform ${settings.fullscreenMode ? 'translate-x-6' : 'translate-x-0'}`} 
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <span className="mr-3">Text Size</span>
                </div>
                <div className="flex items-center justify-between">
                  <button 
                    className="p-2 text-gray-600 hover:text-primary transition-colors"
                    onClick={() => {
                      const sizes = ['small', 'medium', 'large'] as const;
                      const currentIndex = sizes.indexOf(settings.textSize);
                      const newIndex = Math.max(0, currentIndex - 1);
                      toggleSetting('textSize', sizes[newIndex]);
                    }}
                    disabled={settings.textSize === 'small'}
                  >
                    <MinusCircle className="h-5 w-5" />
                  </button>
                  
                  <div className="flex-1 mx-4">
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        {['small', 'medium', 'large'].map((size) => (
                          <div
                            key={size}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap justify-center ${settings.textSize === size ? 'bg-primary' : 'bg-gray-300'}`}
                            style={{ width: '33.333%' }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-xs px-1 mt-1">
                        <span>Small</span>
                        <span>Medium</span>
                        <span>Large</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="p-2 text-gray-600 hover:text-primary transition-colors"
                    onClick={() => {
                      const sizes = ['small', 'medium', 'large'] as const;
                      const currentIndex = sizes.indexOf(settings.textSize);
                      const newIndex = Math.min(sizes.length - 1, currentIndex + 1);
                      toggleSetting('textSize', sizes[newIndex]);
                    }}
                    disabled={settings.textSize === 'large'}
                  >
                    <PlusCircle className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
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
            variant="outline"
            icon={<ArrowLeft className="text-white" />}
            onClick={() => navigate('/topics')}
            className="h-[40px] w-[225px] bg-[rgb(var(--color-button))] hover:bg-[rgb(var(--color-button))/0.8] text-white border-[2px] border-solid border-[#000000]"
          >
            Back to topics
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;