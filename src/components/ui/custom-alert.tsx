
import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationSound } from '@/hooks/use-notification-sound';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

interface CustomAlertProps {
  type: AlertType;
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  type = 'info',
  title,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  const { playSound } = useNotificationSound();

  // Auto-close the alert after the specified duration
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  // Play sound when alert becomes visible
  useEffect(() => {
    if (isVisible) {
      playSound(type === 'success' ? 'success' : type === 'error' ? 'error' : 'alert');
    }
  }, [isVisible, type, playSound]);

  // Alert style variants based on type
  const alertStyles = {
    info: "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800",
    success: "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800",
    warning: "bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800",
    error: "bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800",
  };

  const iconStyles = {
    info: "text-blue-500 dark:text-blue-400",
    success: "text-green-500 dark:text-green-400",
    warning: "text-amber-500 dark:text-amber-400",
    error: "text-red-500 dark:text-red-400",
  };

  const Icon = () => {
    switch (type) {
      case 'info':
        return <Info className={`h-5 w-5 ${iconStyles[type]}`} />;
      case 'success':
        return <CheckCircle className={`h-5 w-5 ${iconStyles[type]}`} />;
      case 'error':
        return <AlertCircle className={`h-5 w-5 ${iconStyles[type]}`} />;
      case 'warning':
        return <AlertCircle className={`h-5 w-5 ${iconStyles[type]}`} />;
      default:
        return <Info className={`h-5 w-5 ${iconStyles.info}`} />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md`}
        >
          <div className={`flex items-start gap-3 rounded-lg border p-4 shadow-lg ${alertStyles[type]}`}>
            <div className="flex-shrink-0">
              <Icon />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{title}</h3>
              <div className="text-sm mt-1">{message}</div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
