import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TrainingModule } from '../types/training';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (module: Omit<TrainingModule, 'id'>) => void;
}

const AddTrainingModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    dueDate: '',
    mandatory: true,
    courseSource: '',
    startDate: new Date().toISOString().split('T')[0],
    completedBy: 0,
    totalStaff: 24,
  });

  const categories = [
    'Youth Work',
    'Mental Health',
    'Safeguarding',
    'Community Development',
    'Care Planning',
    'Food Safety',
    'First Aid',
    'Mental Health Treatment',
    'Conflict Management',
    'Leadership and Management'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      status: 'pending',
      completionDate: null,
    });
    setFormData({
      title: '',
      category: '',
      dueDate: '',
      mandatory: true,
      courseSource: '',
      startDate: new Date().toISOString().split('T')[0],
      completedBy: 0,
      totalStaff: 24,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add New Training Module</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Course Source</label>
              <input
                type="text"
                required
                value={formData.courseSource}
                onChange={(e) => setFormData({ ...formData, courseSource: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="mandatory"
                checked={formData.mandatory}
                onChange={(e) => setFormData({ ...formData, mandatory: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="mandatory" className="ml-2 block text-sm text-gray-900">
                Mandatory Training
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
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
              Add Module
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTrainingModal;