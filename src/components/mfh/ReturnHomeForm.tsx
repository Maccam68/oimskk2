import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ReturnHomeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (returnData: {
    returnDate: string;
    returnLocation: string;
    returnCircumstances: string;
    foundBy: string;
    physicalCondition: string;
    mentalState: string;
    followUpActions: string[];
  }) => void;
}

const ReturnHomeForm: React.FC<ReturnHomeFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    returnDate: new Date().toISOString().slice(0, 16),
    returnLocation: '',
    returnCircumstances: '',
    foundBy: '',
    physicalCondition: '',
    mentalState: '',
    followUpActions: ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addFollowUpAction = () => {
    setFormData(prev => ({
      ...prev,
      followUpActions: [...prev.followUpActions, '']
    }));
  };

  const removeFollowUpAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      followUpActions: prev.followUpActions.filter((_, i) => i !== index)
    }));
  };

  const updateFollowUpAction = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      followUpActions: prev.followUpActions.map((action, i) => i === index ? value : action)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Return Home Report</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Return Date/Time</label>
              <input
                type="datetime-local"
                required
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Found By</label>
              <input
                type="text"
                required
                value={formData.foundBy}
                onChange={(e) => setFormData({ ...formData, foundBy: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Return Location</label>
            <input
              type="text"
              required
              value={formData.returnLocation}
              onChange={(e) => setFormData({ ...formData, returnLocation: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Physical Condition</label>
            <select
              required
              value={formData.physicalCondition}
              onChange={(e) => setFormData({ ...formData, physicalCondition: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select condition</option>
              <option value="good">Good</option>
              <option value="minor_injuries">Minor Injuries</option>
              <option value="requires_medical">Requires Medical Attention</option>
              <option value="hospitalized">Hospitalized</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mental State</label>
            <select
              required
              value={formData.mentalState}
              onChange={(e) => setFormData({ ...formData, mentalState: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select state</option>
              <option value="stable">Stable</option>
              <option value="distressed">Distressed</option>
              <option value="confused">Confused</option>
              <option value="requires_assessment">Requires Assessment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Return Circumstances</label>
            <textarea
              required
              value={formData.returnCircumstances}
              onChange={(e) => setFormData({ ...formData, returnCircumstances: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Follow-up Actions</label>
              <button
                type="button"
                onClick={addFollowUpAction}
                className="text-indigo-600 hover:text-indigo-900 text-sm"
              >
                + Add Action
              </button>
            </div>
            {formData.followUpActions.map((action, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={action}
                  onChange={(e) => updateFollowUpAction(index, e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter follow-up action"
                />
                {formData.followUpActions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFollowUpAction(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
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
              Submit Return Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnHomeForm;