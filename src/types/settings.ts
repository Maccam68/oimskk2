export interface AppSettings {
  organization: {
    name: string;
    logo?: string;
    address: string;
    phone: string;
    email: string;
  };
  notifications: {
    emailNotifications: boolean;
    supervisionReminders: boolean;
    trainingReminders: boolean;
    complianceAlerts: boolean;
    reminderDays: number;
  };
  security: {
    sessionTimeout: number;
    passwordExpiryDays: number;
    mfaEnabled: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'system';
    dateFormat: string;
    timeFormat: '12h' | '24h';
    defaultView: 'dashboard' | 'staff' | 'training' | 'compliance';
  };
}

export const defaultSettings: AppSettings = {
  organization: {
    name: '',
    logo: '',
    address: '',
    phone: '',
    email: ''
  },
  notifications: {
    emailNotifications: true,
    supervisionReminders: true,
    trainingReminders: true,
    complianceAlerts: true,
    reminderDays: 7
  },
  security: {
    sessionTimeout: 30,
    passwordExpiryDays: 90,
    mfaEnabled: false
  },
  display: {
    theme: 'light',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    defaultView: 'dashboard'
  }
};