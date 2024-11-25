import React from 'react';
import { Building2, Phone, Mail, MapPin } from 'lucide-react';
import { AppSettings } from '../../types/settings';

interface Props {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

const OrganizationSettings: React.FC<Props> = ({ settings, onUpdate }) => {
  const handleChange = (field: keyof AppSettings['organization'], value: string) => {
    onUpdate({
      ...settings,
      organization: {
        ...settings.organization,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Organization Name</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Building2 className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={settings.organization.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={settings.organization.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={settings.organization.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={settings.organization.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSettings;