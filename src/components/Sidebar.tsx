import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserSearch,
  ClipboardList,
  ClipboardCheck,
  Settings,
  ChevronFirst,
  ChevronLast,
  LogOut,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const mainMenuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/missing-persons', icon: UserSearch, label: 'MFH' },
    { path: '/compliance', icon: ClipboardCheck, label: 'Compliance' },
  ];

  const staffManagementItems = [
    { path: '/staff', icon: Users, label: 'Staff List' },
    { path: '/training', icon: GraduationCap, label: 'Training' },
    { path: '/supervisions', icon: ClipboardList, label: 'Supervisions' },
    { path: '/ofsted-requirements', icon: FileCheck, label: 'Ofsted Requirements' },
  ];

  return (
    <div 
      className={`relative bg-white h-[calc(100vh-4rem)] border-r border-gray-200 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-white border border-gray-200 rounded-full p-1.5 hover:bg-gray-100"
      >
        {isCollapsed ? (
          <ChevronLast className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronFirst className="h-4 w-4 text-gray-600" />
        )}
      </button>

      <nav className="flex-1 mt-5 px-2">
        <div className="space-y-1">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`h-5 w-5 ${
                    location.pathname === item.path ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}

          <div>
            <button
              onClick={() => {}}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full ${
                isCollapsed ? 'justify-center' : 'justify-between'
              }`}
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                {!isCollapsed && <span className="ml-3">Staff Management</span>}
              </div>
            </button>

            <div className="space-y-1 ml-3">
              {staffManagementItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        location.pathname === item.path ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {!isCollapsed && <span className="ml-3">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <div className="px-2 pb-6 space-y-1">
        <Link
          to="/settings"
          className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          title={isCollapsed ? "Settings" : undefined}
        >
          <Settings className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
          {!isCollapsed && <span className="ml-3">Settings</span>}
        </Link>

        <button
          onClick={handleLogout}
          className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 hover:text-red-900"
          title={isCollapsed ? "Log Out" : undefined}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Log Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;