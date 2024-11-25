import { api } from './api';
import type { OfstedSection, OfstedRequirement } from '../types/ofsted';

export const ofstedService = {
  getAllSections: async (): Promise<OfstedSection[]> => {
    return api.get('/ofsted/sections');
  },

  getSection: async (id: number): Promise<OfstedSection> => {
    return api.get(`/ofsted/sections/${id}`);
  },

  updateRequirementStatus: async (
    id: number,
    status: 'completed' | 'in_progress' | 'not_started',
    notes?: string
  ): Promise<OfstedRequirement> => {
    return api.patch(`/ofsted/requirements/${id}`, { status, notes });
  },

  addEvidence: async (
    requirementId: number,
    fileUrl: string,
    description: string,
    uploadedBy: number
  ): Promise<void> => {
    return api.post('/ofsted/evidence', {
      requirementId,
      fileUrl,
      description,
      uploadedBy
    });
  }
};