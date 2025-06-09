import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Maximize, MinusCircle, PlusCircle, Save, ArrowLeft } from 'lucide-react';
import Card, { CardHeader, CardBody, CardFooter } from '../components/UI/Card';
import Button from '../components/UI/Button';
import { UserSettings } from '../types';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState<UserSettings>({
    musicEnabled: true,
    soundEffectsEnabled: true,
    fullscreenMode: false,
    textSize: 'medium',
  });
  
  const toggleSetting = (key: keyof UserSettings, value?: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value !== undefined ? value : !prev[key as keyof typeof prev],
    }));
  };
  
  const handleSave = () => {
    // In a real app, this would save settings to localStorage or a backend
    navigate(-1); // Go back to previous screen
  };
  
  const textSizeOptions = {
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
  };
  
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
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Volume2 className="h-5 w-5 mr-3 text-gray-700" />
                  <span>Background Music</span>
                </div>
                <div 
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.musicEnabled ? 'bg-primary' : 'bg-gray-300'}`}
                  onClick={() => toggleSetting('musicEnabled')}
                >
                  <div 
                    className={`bg-white h-4 w-4 rounded-full shadow-md transform transition-transform ${settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'}`} 
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <VolumeX className="h-5 w-5 mr-3 text-gray-700" />
                  <span>Sound Effects</span>
                </div>
                <div 
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.soundEffectsEnabled ? 'bg-primary' : 'bg-gray-300'}`}
                  onClick={() => toggleSetting('soundEffectsEnabled')}
                >
                  <div 
                    className={`bg-white h-4 w-4 rounded-full shadow-md transform transition-transform ${settings.soundEffectsEnabled ? 'translate-x-6' : 'translate-x-0'}`} 
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
                        {['small', 'medium', 'large'].map((size, index) => (
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
        
        <CardFooter className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="h-[40px] w-[225px] bg-[rgb(var(--color-secondary-button))] hover:bg-[rgb(var(--color-secondary-button))/0.8] text-[rgb(var(--color-text-white))] border-2 border-black"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            icon={<ArrowLeft className="text-white" />}
            onClick={() => navigate('/')}
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