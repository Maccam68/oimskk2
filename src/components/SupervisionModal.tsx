import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { SupervisionFormData } from '../types/supervision';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SupervisionFormData) => void;
  staffMembers: Array<{ id: number; name: string }>;
  initialData?: SupervisionFormData;
}

const SupervisionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  staffMembers,
  initialData
}) => {
  const [formData, setFormData] = useState<SupervisionFormData>(
    initialData || {
      staffId: 0,
      supervisorName: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      actions: [''],
      outcomes: [''],
      nextSupervisionDate: ''
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      actions: formData.actions.filter(action => action.trim() !== ''),
      outcomes: formData.outcomes.filter(outcome => outcome.trim() !== '')
    });
  };

  const addAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [...prev.actions, '']
    }));
  };

  const addOutcome = () => {
    setFormData(prev => ({
      ...prev,
      outcomes: [...prev.outcomes, '']
    }));
  };

  const updateAction = (index: number, value: string) => {
    const newActions = [...formData.actions];
    newActions[index] = value;
    setFormData(prev => ({
      ...prev,
      actions: newActions
    }));
  };

  const updateOutcome = (index: number, value: string) => {
    const newOutcomes = [...formData.outcomes];
    newOutcomes[index] = value;
    setFormData(prev => ({
      ...prev,
      outcomes: newOutcomes
    }));
  };

  const removeAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const removeOutcome = (index: number) => {
    setFormData(prev => ({
      ...prev,
      outcomes: prev.outcomes.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Supervision' : 'Schedule New Supervision'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Staff Member</label>
              <select
                required
                value={formData.staffId}
                onChange={(e) => setFormData({ ...formData, staffId: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Staff Member</option>
                {staffMembers.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Supervisor Name</label>
              <input
                type="text"
                required
                value={formData.supervisorName}
                onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter supervisor name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Supervision Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Next Supervision Date</label>
              <input
                type="date"
                required
                value={formData.nextSupervisionDate}
                onChange={(e) => setFormData({ ...formData, nextSupervisionDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Supervision Notes</label>
            <textarea
              required
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
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
            {formData.actions.map((action, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={action}
                  onChange={(e) => updateAction(index, e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter action item"
                />
                <button
                  type="button"
                  onClick={() => removeAction(index)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Outcomes</label>
              <button
                type="button"
                onClick={addOutcome}
                className="text-indigo-600 hover:text-indigo-900 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Outcome
              </button>
            </div>
            {formData.outcomes.map((outcome, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={outcome}
                  onChange={(e) => updateOutcome(index, e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter outcome"
                />
                <button
                  type="button"
                  onClick={() => removeOutcome(index)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
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
              {initialData ? 'Update' : 'Schedule'} Supervision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupervisionModal;