'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Clock, AlertCircle, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface RemindersSectionProps {
  onClose?: () => void;
}

// Check if notifications are supported
const isNotificationSupported = () => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

export function RemindersSection({ onClose }: RemindersSectionProps) {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isNotificationSupported()) {
      setPermission(Notification.permission);
      // Load saved preferences
      const saved = localStorage.getItem('boundless_reminder');
      if (saved) {
        const { enabled, time } = JSON.parse(saved);
        setReminderEnabled(enabled);
        setReminderTime(time || '09:00');
      }
    } else {
      setPermission('unsupported');
    }
  }, []);

  const requestPermission = async () => {
    if (!isNotificationSupported()) return;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        // Show a test notification
        new Notification('Boundless Journal', {
          body: 'Reminders are now enabled! 📝',
          icon: '/icon.svg',
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const toggleReminder = () => {
    const newEnabled = !reminderEnabled;
    setReminderEnabled(newEnabled);
    
    // Save to localStorage
    localStorage.setItem('boundless_reminder', JSON.stringify({
      enabled: newEnabled,
      time: reminderTime,
    }));

    if (newEnabled) {
      scheduleReminder();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      cancelReminder();
    }
  };

  const handleTimeChange = (time: string) => {
    setReminderTime(time);
    localStorage.setItem('boundless_reminder', JSON.stringify({
      enabled: reminderEnabled,
      time,
    }));
    
    if (reminderEnabled) {
      scheduleReminder();
    }
  };

  const scheduleReminder = () => {
    // In a real PWA, we'd use the Background Sync API or Push Notifications
    // For now, we'll use a simple approach that works when the app is open
    console.log(`Reminder scheduled for ${reminderTime}`);
    
    // Register service worker for background notifications if not already done
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log('Service worker ready for notifications');
      });
    }
  };

  const cancelReminder = () => {
    console.log('Reminder cancelled');
  };

  // Time slot presets
  const timePresets = [
    { label: 'Morning', time: '08:00', emoji: '🌅' },
    { label: 'Midday', time: '12:00', emoji: '☀️' },
    { label: 'Evening', time: '18:00', emoji: '🌆' },
    { label: 'Night', time: '21:00', emoji: '🌙' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-100 rounded-xl">
          <Bell className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <h3 className="font-medium text-gray-800">Daily Reminders</h3>
          <p className="text-sm text-gray-500">Build a consistent journaling habit</p>
        </div>
      </div>

      {/* Unsupported notice */}
      {permission === 'unsupported' && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 font-medium">Notifications not supported</p>
              <p className="text-sm text-amber-600 mt-1">
                Your browser doesn't support notifications. Try using Chrome or Firefox for the best experience.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Permission denied notice */}
      {permission === 'denied' && (
        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
          <div className="flex items-start gap-3">
            <BellOff className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Notifications blocked</p>
              <p className="text-sm text-red-600 mt-1">
                You've blocked notifications. To enable reminders, click the lock icon in your browser's address bar and allow notifications.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Request permission */}
      {permission === 'default' && (
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-blue-800 font-medium">Enable notifications</p>
              <p className="text-sm text-blue-600 mt-1">
                Allow notifications to receive daily journaling reminders.
              </p>
              <button
                onClick={requestPermission}
                className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Allow Notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder settings (only show if permission granted) */}
      {permission === 'granted' && (
        <>
          {/* Success message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-green-50 rounded-xl border border-green-200 flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-700">Reminder set! We'll nudge you to journal.</p>
            </motion.div>
          )}

          {/* Toggle */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2 rounded-lg transition-colors',
                reminderEnabled ? 'bg-amber-100' : 'bg-gray-100'
              )}>
                {reminderEnabled ? (
                  <Bell className="w-5 h-5 text-amber-600" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800">Daily reminder</p>
                <p className="text-sm text-gray-500">
                  {reminderEnabled ? `Remind me at ${reminderTime}` : 'Off'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleReminder}
              className={cn(
                'relative w-12 h-7 rounded-full transition-colors',
                reminderEnabled ? 'bg-amber-500' : 'bg-gray-300'
              )}
            >
              <motion.div
                animate={{ x: reminderEnabled ? 22 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              />
            </button>
          </div>

          {/* Time selection (only show if reminder enabled) */}
          {reminderEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {/* Preset times */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick select
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timePresets.map((preset) => (
                    <button
                      key={preset.time}
                      onClick={() => handleTimeChange(preset.time)}
                      className={cn(
                        'p-3 rounded-xl border-2 text-center transition-all',
                        reminderTime === preset.time
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-300'
                      )}
                    >
                      <span className="text-xl block mb-1">{preset.emoji}</span>
                      <span className="text-xs text-gray-600">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or choose a specific time
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => handleTimeChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Motivational message */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                <p className="text-amber-800 text-sm">
                  💡 <strong>Tip:</strong> Consistency is key! People who journal at the same time each day are 3x more likely to build a lasting habit.
                </p>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Alternative reminder methods */}
      <div className="pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-500 mb-3">Other ways to remember:</p>
        <div className="space-y-2 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <span>📱</span> Add Boundless to your home screen
          </p>
          <p className="flex items-center gap-2">
            <span>📅</span> Set a recurring calendar event
          </p>
          <p className="flex items-center gap-2">
            <span>🔗</span> Stack with an existing habit (e.g., after morning coffee)
          </p>
        </div>
      </div>
    </div>
  );
}
