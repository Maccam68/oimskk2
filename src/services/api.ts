import type { OfstedSection, OfstedRequirement } from '../types/ofsted';

const API_BASE = '/api';

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  patch: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },
};