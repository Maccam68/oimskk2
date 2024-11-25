import React from 'react';
import { ClipboardList, Bell, Settings, User } from 'lucide-react';
import useSettings from '../hooks/useSettings';

const Navbar = () => {
  const [settings] = useSettings();
  const { name: organizationName } = settings.organization;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Ofsted Compliance Platform
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Settings className="h-6 w-6" />
              </button>
              <div className="flex items-center">
                <User className="h-8 w-8 text-gray-400 bg-gray-100 rounded-full p-1" />
                <span className="ml-2 text-sm font-medium text-gray-700">Admin</span>
              </div>
            </div>
          </div>
          {organizationName && (
            <div className="pb-2">
              <span className="text-sm font-medium text-gray-600">{organizationName}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;