import React from 'react';
import { Bell } from 'lucide-react';
import { AppSettings } from '../../types/settings';

interface Props {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

const NotificationSettings: React.FC<Props> = ({ settings, onUpdate }) => {
  const handleToggle = (field: keyof AppSettings['notifications'], value: boolean) => {
    onUpdate({
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: value
      }
    });
  };

  const handleReminderDays = (days: number) => {
    onUpdate({
      ...settings,
      notifications: {
        ...settings.notifications,
        reminderDays: days
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-700">Email Notifications</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.emailNotifications}
            onChange={(e) => handleToggle('emailNotifications', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Supervision Reminders</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.supervisionReminders}
            onChange={(e) => handleToggle('supervisionReminders', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Training Reminders</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.trainingReminders}
            onChange={(e) => handleToggle('trainingReminders', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Compliance Alerts</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.complianceAlerts}
            onChange={(e) => handleToggle('complianceAlerts', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Reminder Days</label>
        <input
          type="number"
          min="1"
          max="30"
          value={settings.notifications.reminderDays}
          onChange={(e) => handleReminderDays(parseInt(e.target.value, 10))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <p className="mt-1 text-sm text-gray-500">Days before due date to send reminders</p>
      </div>
    </div>
  );
};

export default NotificationSettings;