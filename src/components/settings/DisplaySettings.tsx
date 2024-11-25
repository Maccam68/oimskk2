import React from 'react';
import { Palette, Calendar, Clock, Layout } from 'lucide-react';
import { AppSettings } from '../../types/settings';

interface Props {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

const DisplaySettings: React.FC<Props> = ({ settings, onUpdate }) => {
  const handleChange = (field: keyof AppSettings['display'], value: string) => {
    onUpdate({
      ...settings,
      display: {
        ...settings.display,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center mb-2">
          <Palette className="h-5 w-5 text-gray-400 mr-2" />
          <label className="text-sm font-medium text-gray-700">Theme</label>
        </div>
        <select
          value={settings.display.theme}
          onChange={(e) => handleChange('theme', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
          <label className="text-sm font-medium text-gray-700">Date Format</label>
        </div>
        <select
          value={settings.display.dateFormat}
          onChange={(e) => handleChange('dateFormat', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <Clock className="h-5 w-5 text-gray-400 mr-2" />
          <label className="text-sm font-medium text-gray-700">Time Format</label>
        </div>
        <select
          value={settings.display.timeFormat}
          onChange={(e) => handleChange('timeFormat', e.target.value as '12h' | '24h')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="12h">12-hour</option>
          <option value="24h">24-hour</option>
        </select>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <Layout className="h-5 w-5 text-gray-400 mr-2" />
          <label className="text-sm font-medium text-gray-700">Default View</label>
        </div>
        <select
          value={settings.display.defaultView}
          onChange={(e) => handleChange('defaultView', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="dashboard">Dashboard</option>
          <option value="staff">Staff Management</option>
          <option value="training">Training</option>
          <option value="compliance">Compliance</option>
        </select>
      </div>
    </div>
  );
};

export default DisplaySettings;