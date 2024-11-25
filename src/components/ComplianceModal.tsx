import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { ComplianceRequirement, Evidence, Action } from '../types/compliance';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ComplianceRequirement>) => void;
  initialData?: ComplianceRequirement | null;
  categories: string[];
}

const ComplianceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories
}) => {
  const [formData, setFormData] = useState<Partial<ComplianceRequirement>>(
    initialData || {
      category: '',
      title: '',
      description: '',
      dueDate: '',
      status: 'pending-review',
      lastReviewDate: new Date().toISOString().split('T')[0],
      nextReviewDate: '',
      assignedTo: [],
      evidence: [],
      actions: []
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addEvidence = () => {
    const newEvidence: Evidence = {
      id: Math.max(0, ...(formData.evidence || []).map(e => e.id)) + 1,
      title: '',
      description: '',
      dateUploaded: new Date().toISOString(),
      documentType: '',
      location: ''
    };
    setFormData(prev => ({
      ...prev,
      evidence: [...(prev.evidence || []), newEvidence]
    }));
  };

  const addAction = () => {
    const newAction: Action = {
      id: Math.max(0, ...(formData.actions || []).map(a => a.id)) + 1,
      description: '',
      dueDate: '',
      status: 'pending',
      assignedTo: 0
    };
    setFormData(prev => ({
      ...prev,
      actions: [...(prev.actions || []), newAction]
    }));
  };

  const updateEvidence = (index: number, field: keyof Evidence, value: string) => {
    const newEvidence = [...(formData.evidence || [])];
    newEvidence[index] = { ...newEvidence[index], [field]: value };
    setFormData(prev => ({ ...prev, evidence: newEvidence }));
  };

  const updateAction = (index: number, field: keyof Action, value: string | number) => {
    const newActions = [...(formData.actions || [])];
    newActions[index] = { ...newActions[index], [field]: value };
    setFormData(prev => ({ ...prev, actions: newActions }));
  };

  const removeEvidence = (index: number) => {
    setFormData(prev => ({
      ...prev,
      evidence: (prev.evidence || []).filter((_, i) => i !== index)
    }));
  };

  const removeAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actions: (prev.actions || []).filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Requirement' : 'Add New Requirement'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ComplianceRequirement['status'] })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="compliant">Compliant</option>
                <option value="non-compliant">Non-Compliant</option>
                <option value="pending-review">Pending Review</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Review Date</label>
              <input
                type="date"
                required
                value={formData.lastReviewDate}
                onChange={(e) => setFormData({ ...formData, lastReviewDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Next Review Date</label>
              <input
                type="date"
                required
                value={formData.nextReviewDate}
                onChange={(e) => setFormData({ ...formData, nextReviewDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Evidence</label>
              <button
                type="button"
                onClick={addEvidence}
                className="text-indigo-600 hover:text-indigo-900 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Evidence
              </button>
            </div>
            {formData.evidence?.map((evidence, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  value={evidence.title}
                  onChange={(e) => updateEvidence(index, 'title', e.target.value)}
                  placeholder="Title"
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={evidence.documentType}
                  onChange={(e) => updateEvidence(index, 'documentType', e.target.value)}
                  placeholder="Document Type"
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={evidence.location}
                    onChange={(e) => updateEvidence(index, 'location', e.target.value)}
                    placeholder="Location"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeEvidence(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Actions</label>
              <button
                type="button"
                onClick={addAction}
                className="text-indigo-600 hover:text-indigo-900 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Action
              </button>
            </div>
            {formData.actions?.map((action, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  value={action.description}
                  onChange={(e) => updateAction(index, 'description', e.target.value)}
                  placeholder="Description"
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  value={action.dueDate}
                  onChange={(e) => updateAction(index, 'dueDate', e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <div className="flex items-center space-x-2">
                  <select
                    value={action.status}
                    onChange={(e) => updateAction(index, 'status', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeAction(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              {initialData ? 'Update' : 'Add'} Requirement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplianceModal;