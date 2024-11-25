import React, { useState } from 'react';
import { Settings as SettingsIcon, Building2, Bell, Shield, Palette, Save, Download, Upload, Users } from 'lucide-react';
import useSettings from '../hooks/useSettings';
import OrganizationSettings from '../components/settings/OrganizationSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import DisplaySettings from '../components/settings/DisplaySettings';
import UserManagement from '../components/settings/UserManagement';
import { AppSettings, defaultSettings } from '../types/settings';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const [settings, setSettings] = useSettings();
  const [activeTab, setActiveTab] = useState('organization');
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportSettings = () => {
    const settingsBlob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(settingsBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settings-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        const mergedSettings = {
          ...defaultSettings,
          ...importedSettings
        };
        setSettings(mergedSettings as AppSettings);
        alert('Settings imported successfully!');
      } catch (error) {
        alert('Error importing settings. Please check the file format.');
      }
    };
    reader.readAsText(file);
    if (event.target) {
      event.target.value = '';
    }
  };

  const tabs = [
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'display', label: 'Display', icon: Palette },
    ...(user?.role === 'admin' ? [{ id: 'users', label: 'Users', icon: Users }] : []),
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <SettingsIcon className="h-6 w-6 text-gray-600 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleExportSettings}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Export Backup
          </button>
          <button
            onClick={handleImportClick}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center"
          >
            <Upload className="h-5 w-5 mr-2" />
            Import Backup
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportSettings}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
          >
            <Save className="h-5 w-5 mr-2" />
            {isSaved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className={`-ml-1 mr-2 h-5 w-5 ${
                  activeTab === id ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'organization' && (
            <OrganizationSettings settings={settings} onUpdate={setSettings} />
          )}
          {activeTab === 'notifications' && (
            <NotificationSettings settings={settings} onUpdate={setSettings} />
          )}
          {activeTab === 'security' && (
            <SecuritySettings settings={settings} onUpdate={setSettings} />
          )}
          {activeTab === 'display' && (
            <DisplaySettings settings={settings} onUpdate={setSettings} />
          )}
          {activeTab === 'users' && user?.role === 'admin' && (
            <UserManagement />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;