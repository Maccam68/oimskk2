import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { StaffMember, Qualification, Employment, Reference } from '../types/staff';

interface StaffModalProps {
  staff: StaffMember;
  isOpen: boolean;
  mode: 'view' | 'edit';
  onClose: () => void;
  onSave?: (staff: StaffMember) => void;
  onDeactivate?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const StaffModal: React.FC<StaffModalProps> = ({
  staff,
  isOpen,
  mode,
  onClose,
  onSave,
  onDeactivate,
  onDelete,
}) => {
  const [formData, setFormData] = useState(staff);
  const [activeTab, setActiveTab] = useState('basic');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addQualification = () => {
    const newQualification: Qualification = {
      id: Math.max(0, ...formData.qualifications.map(q => q.id)) + 1,
      title: '',
      institution: '',
      dateAchieved: '',
    };
    setFormData({
      ...formData,
      qualifications: [...formData.qualifications, newQualification]
    });
  };

  const addEmployment = () => {
    const newEmployment: Employment = {
      id: Math.max(0, ...formData.employmentHistory.map(e => e.id)) + 1,
      employer: '',
      position: '',
      startDate: '',
      endDate: '',
      reasonForLeaving: '',
      contactDetails: ''
    };
    setFormData({
      ...formData,
      employmentHistory: [...formData.employmentHistory, newEmployment]
    });
  };

  const addReference = () => {
    const newReference: Reference = {
      id: Math.max(0, ...formData.references.map(r => r.id)) + 1,
      name: '',
      position: '',
      organization: '',
      email: '',
      phone: '',
      relationship: '',
      verified: false
    };
    setFormData({
      ...formData,
      references: [...formData.references, newReference]
    });
  };

  const updateQualification = (id: number, field: keyof Qualification, value: string | boolean) => {
    setFormData({
      ...formData,
      qualifications: formData.qualifications.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      )
    });
  };

  const updateEmployment = (id: number, field: keyof Employment, value: string) => {
    setFormData({
      ...formData,
      employmentHistory: formData.employmentHistory.map(e =>
        e.id === id ? { ...e, [field]: value } : e
      )
    });
  };

  const updateReference = (id: number, field: keyof Reference, value: string | boolean) => {
    setFormData({
      ...formData,
      references: formData.references.map(r =>
        r.id === id ? { ...r, [field]: value } : r
      )
    });
  };

  const removeQualification = (id: number) => {
    setFormData({
      ...formData,
      qualifications: formData.qualifications.filter(q => q.id !== id)
    });
  };

  const removeEmployment = (id: number) => {
    setFormData({
      ...formData,
      employmentHistory: formData.employmentHistory.filter(e => e.id !== id)
    });
  };

  const removeReference = (id: number) => {
    setFormData({
      ...formData,
      references: formData.references.filter(r => r.id !== id)
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'view' ? 'Staff Details' : 'Edit Staff Member'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['basic', 'qualifications', 'employment', 'references'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === 'basic' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">DBS Number</label>
                <input
                  type="text"
                  name="dbs"
                  value={formData.dbs}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'qualifications' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Qualifications</h3>
                {mode === 'edit' && (
                  <button
                    type="button"
                    onClick={addQualification}
                    className="text-indigo-600 hover:text-indigo-900 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Qualification
                  </button>
                )}
              </div>
              {formData.qualifications.map((qualification) => (
                <div key={qualification.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        value={qualification.title}
                        onChange={(e) => updateQualification(qualification.id, 'title', e.target.value)}
                        disabled={mode === 'view'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Institution</label>
                      <input
                        type="text"
                        value={qualification.institution}
                        onChange={(e) => updateQualification(qualification.id, 'institution', e.target.value)}
                        disabled={mode === 'view'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date Achieved</label>
                      <input
                        type="date"
                        value={qualification.dateAchieved}
                        onChange={(e) => updateQualification(qualification.id, 'dateAchieved', e.target.value)}
                        disabled={mode === 'view'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                      <input
                        type="date"
                        value={qualification.expiryDate || ''}
                        onChange={(e) => updateQualification(qualification.id, 'expiryDate', e.target.value)}
                        disabled={mode === 'view'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  {mode === 'edit' && (
                    <button
                      type="button"
                      onClick={() => removeQualification(qualification.id)}
                      className="mt-2 text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'employment' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Employment History</h3>
                {mode === 'edit' && (
                  <button
                    type="button"
                    onClick={addEmployment}
                    className="text-indigo-600 hover:text-indigo-900 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Employment
                  </button>
                )}
              </div>
              {formData.employmentHistory.map((employment) => (
                <div key={employment.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Employer</label>
                      <input
                        type="text"
                        value={employment.employer}
                        onChange={(e) => updateEmployment(employment.id, 'employer', e.target.value)}
                        disabled={mode === 'view'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Position</label>
                      <input
                        type="text"
                        value={employment.position}
                        onChange={(e) => updateEmployment(employment.id, 'position', e.target.value)}
                        disabled={mode === 'view'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="date"
                        value={employment.startDate}
                        onChange={(e) => updateEmployment(employment.id, 'startDate', e.target.value)}
                        disabled={mode === 'view'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="date"
                        value={employment.endDate}
                        onChange={(e) => updateEmployment(employment.id, 'endDate', e.target.value)}
                        disabled={mode === 'view'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Reason for Leaving</label>
                      <input
                        type="text"
                        value={employment.reasonForLeaving}
                        onChange={(e) => updateEmployment(employment.id, 'reasonForLeaving', e.target.value)}
                        disabled={mode === 'view'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Contact Details</label>
                      <input
                        type="text"
                        value={employment.contactDetails}
                        onChange={(e) => updateEmployment(employment.id, 'contactDetails', e.target.value)}
                        disabled={mode === 'view'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  {mode === 'edit' && (
                    <button
                      type="button"
                      onClick={() => removeEmployment(employment.id)}
                      className="mt-2 text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'references' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">References</h3>
                {mode === 'edit' && (
                  <button
                    type="button"
                    onClick={addReference}
                    className="text-indigo-600 hover:text-indigo-900 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Reference
                  </button>
                )}
              </div>
              {formData.references.map((reference) => (
                <div key={reference.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={reference.name}
                        onChange={(e) => updateReference(reference.id, 'name', e.target.value)}
                        disabled={mode === 'view'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Position</label>
                      <input
                        type="text"
                        value={reference.position}
                        onChange={(e) => updateReference(reference.id, 'position', e.target.value)}
                        disabled={mode === 'view'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Organization</label>
                      <input
                        type="text"
                        value={reference.organization}
                        onChange={(e) => updateReference(reference.id, 'organization', e.target.value)}
                        disabled={mode === 'view'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Relationship</label>
                      <input
                        type="text"
                        value={reference.relationship}
                        onChange={(e) => updateReference(reference.id, 'relationship', e.target.value)}
                        disabled={mode === 'view'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={reference.email}
                        onChange={(e) => updateReference(reference.id, 'email', e.target.value)}
                        disabled={mode === 'view'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        value={reference.phone}
                        onChange={(e) => updateReference(reference.id, 'phone', e.target.value)}
                        disabled={mode === 'view'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    {mode === 'edit' && (
                      <div className="col-span-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={reference.verified}
                            onChange={(e) => updateReference(reference.id, 'verified', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">Reference Verified</span>
                        </label>
                      </div>
                    )}
                    {reference.verified && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Verification Notes</label>
                        <input
                          type="text"
                          value={reference.verificationNotes || ''}
                          onChange={(e) => updateReference(reference.id, 'verificationNotes', e.target.value)}
                          disabled={mode === 'view'}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    )}
                  </div>
                  {mode === 'edit' && (
                    <button
                      type="button"
                      onClick={() => removeReference(reference.id)}
                      className="mt-2 text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            {mode === 'edit' && (
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            )}
            {mode === 'view' && (
              <>
                <button
                  type="button"
                  onClick={() => onDeactivate?.(staff.id)}
                  className="text-yellow-700 bg-yellow-100 px-4 py-2 rounded-md hover:bg-yellow-200"
                >
                  {staff.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete?.(staff.id)}
                  className="text-red-700 bg-red-100 px-4 py-2 rounded-md hover:bg-red-200"
                >
                  Delete
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffModal;