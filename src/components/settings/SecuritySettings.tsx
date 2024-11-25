import React from 'react';
import { Shield, Clock, Key, Smartphone } from 'lucide-react';
import { AppSettings } from '../../types/settings';

interface Props {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

const SecuritySettings: React.FC<Props> = ({ settings, onUpdate }) => {
  const handleChange = (field: keyof AppSettings['security'], value: number | boolean) => {
    onUpdate({
      ...settings,
      security: {
        ...settings.security,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center mb-2">
          <Clock className="h-5 w-5 text-gray-400 mr-2" />
          <label className="text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
        </div>
        <input
          type="number"
          min="5"
          max="120"
          value={settings.security.sessionTimeout}
          onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value, 10))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <div className="flex items-center mb-2">
          <Key className="h-5 w-5 text-gray-400 mr-2" />
          <label className="text-sm font-medium text-gray-700">Password Expiry (days)</label>
        </div>
        <input
          type="number"
          min="30"
          max="365"
          value={settings.security.passwordExpiryDays}
          onChange={(e) => handleChange('passwordExpiryDays', parseInt(e.target.value, 10))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Smartphone className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-700">Multi-Factor Authentication</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.security.mfaEnabled}
            onChange={(e) => handleChange('mfaEnabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>
    </div>
  );
};

export default SecuritySettings;