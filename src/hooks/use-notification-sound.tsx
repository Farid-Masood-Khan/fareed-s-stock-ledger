
import { useSettings } from '@/context/SettingsContext';
import { useEffect, useMemo } from 'react';

type SoundType = 'success' | 'error' | 'warning' | 'info' | 'notification' | 'alert';

interface NotificationSoundHook {
  playSound: (type: SoundType) => void;
}

export function useNotificationSound(): NotificationSoundHook {
  const { settings } = useSettings();
  const { soundEnabled, volume } = settings;
  
  // Create a volume level between 0 and 1 for the Audio API
  const volumeLevel = useMemo(() => (volume || 70) / 100, [volume]);
  
  // Create Audio objects for each sound type
  const sounds = useMemo(() => {
    if (typeof window === 'undefined') return {};
    
    return {
      success: new Audio('/sounds/success.mp3'),
      error: new Audio('/sounds/error.mp3'),
      warning: new Audio('/sounds/warning.mp3'),
      info: new Audio('/sounds/info.mp3'),
      notification: new Audio('/sounds/notification.mp3'),
      alert: new Audio('/sounds/alert.mp3'),
    };
  }, []);
  
  // Update volume when settings change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    Object.values(sounds).forEach(sound => {
      if (sound) {
        sound.volume = volumeLevel;
      }
    });
  }, [sounds, volumeLevel]);
  
  // Play the sound if enabled
  const playSound = (type: SoundType) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    
    const sound = sounds[type];
    if (sound) {
      // Stop and reset the sound before playing
      sound.pause();
      sound.currentTime = 0;
      
      // Play the sound
      sound.play().catch(err => {
        // Browser often blocks autoplay
        console.warn('Sound could not be played:', err.message);
      });
    } else {
      console.warn(`Sound type "${type}" not found`);
    }
  };
  
  return { playSound };
}

export default useNotificationSound;
