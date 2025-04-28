
import { useCallback } from 'react';
import { useSettings } from '@/context/SettingsContext';

// Sound types for different notifications
type NotificationType = 'success' | 'error' | 'alert' | 'info';

export const useNotificationSound = () => {
  const { soundEnabled } = useSettings();

  const playSound = useCallback((type: NotificationType = 'info') => {
    if (!soundEnabled) return;
    
    // Create audio elements for different notification types
    const sounds: Record<NotificationType, string> = {
      success: 'data:audio/wav;base64,UklGRiQEAABXQVZFZm10IBAAAAABAAIARKwAABCxAgAEABAAZGF0YQAEAAD+/vz/+/39//r//f/+//3////////////9/////f/9//3//v/+//7//v/+//7//v/+/wAA/v/9/wAA/v/9//7/AgABAAIAAgABAAQABQAHAAUABgAGAAcACAAGAAUACQAIAAUACAAIAAIABQAEAPz/AQADAPj++v8CAPT69v8HAPL18P8LAPr27v8MAP/49/8OAPX3+P8MAAQE+v8KAAoIAQAIAAcHBQAGAAIBBwAFAP//CAABAP//CQAAAP//BQADAAAAAgACAP7/AQACAP7///8BAP////8BAP7/AAD//wAA/f8AAP7/AAD+////AAD//wAA//8AAP//AAD//wAA',
      error: 'data:audio/wav;base64,UklGRj4QAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRoQAAAAAAD+//7//v/+//7//v/+//7//v/9//3//v/+////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAAD/////AAAAAAEAAQADAAMABAACAAQAAgAEAAQAAwAEAAQAAwAFAAMABAAEAAMABAACAAQABAACAAMAAwACAAMAAgACAAIAAQABAAEA//8AAAEA/v8AAAEA/v8AAP/////+//7//v/+//3//v/9//3//f/9//3//f/9//7//v/+////AAAAAAEAAgADAAQABAAGAAcACAAJAAoACwALAAwADQAMAAwADQANAAwADAAMAAsACgAKAAkACQAIAAcABgAGAAQABAADAAIAAQABAAAA//8AAP////7//v/+//7//v/+//7//v/+//7//v8AAP//AAAAAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAAAAAAAAAAAAAEA',
      alert: 'data:audio/wav;base64,UklGRj4QAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRoQAAAA/f/9//3/+//9//v/+v/7//r/+v/5//j/+v/5//n/+f/5//v/+f/7//3//f/9//7//v8AAP7/AAACAAEAAQADAAEAAQADAAEAAQADAAMA/v8DAAMA/v8DAAUAAQADAAUAAgADAAUA//8DAAUA//8DAAUA//8DAAUAAQADAAUA/v8DAAMA/v8DAAEA/v8DAAEA/v8BAAEA/v8BAAEA/v8BAAEA/v8BAAAA',
      info: 'data:audio/wav;base64,UklGRj4QAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRoQAAAAAAAAAgACAP//AQADAAEAAQADAAEAAAACAAIAAAACAAIAAAAAAAEAAQD+//7/AQACAP7//v8BAAIA/f/9/wEAAgD8//z/AQACAP3//f8BAAEA/v/+/wEAAQD+//3/AQABAP7//v8AAAEA/v/+/wAAAQD+//7/AAABAP3//f8AAAEA/v/+/wAAAQD+//7/AAABAP7//v8AAAEA/f/+/wEAAQD9//3/AQABAP3//f8BAAEA/f/9/wEAAQD9//3/AQABAP3//f8BAAEA/f/+/wAAAQD9//7/AAABAP3//v8AAAEA'
    };

    try {
      const audio = new Audio(sounds[type]);
      audio.play();
    } catch (error) {
      console.error("Error playing notification sound:", error);
    }
  }, [soundEnabled]);

  return { playSound };
};
