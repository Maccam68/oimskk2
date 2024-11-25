import React, { useState } from 'react';
import { ClipboardCheck, AlertCircle, Clock, Plus, ChevronDown, ChevronRight, FileText } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import { ComplianceRequirement } from '../types/compliance';
import ComplianceModal from '../components/ComplianceModal';

const ComplianceManagement = () => {
  const [requirements, setRequirements] = useLocalStorage<ComplianceRequirement[]>('complianceRequirements', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<ComplianceRequirement | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const categories = [
    'Quality of Education',
    'Behaviour and Attitudes',
    'Personal Development',
    'Leadership and Management',
    'Safeguarding',
    'Health and Safety',
    'Staff Development',
    'Documentation'
  ];

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleAddRequirement = () => {
    setSelectedRequirement(null);
    setIsModalOpen(true);
  };

  const handleEditRequirement = (requirement: ComplianceRequirement) => {
    setSelectedRequirement(requirement);
    setIsModalOpen(true);
  };

  const handleSaveRequirement = (formData: Partial<ComplianceRequirement>) => {
    if (selectedRequirement) {
      setRequirements(prev =>
        prev.map(req =>
          req.id === selectedRequirement.id
            ? { ...req, ...formData }
            : req
        )
      );
    } else {
      const newRequirement: ComplianceRequirement = {
        id: Math.max(0, ...requirements.map(r => r.id)) + 1,
        ...formData as Omit<ComplianceRequirement, 'id'>
      };
      setRequirements([...requirements, newRequirement]);
    }
    setIsModalOpen(false);
  };

  const getComplianceStats = () => {
    const total = requirements.length;
    const compliant = requirements.filter(r => r.status === 'compliant').length;
    const nonCompliant = requirements.filter(r => r.status === 'non-compliant').length;
    const pending = requirements.filter(r => r.status === 'pending-review').length;
    const inProgress = requirements.filter(r => r.status === 'in-progress').length;

    return {
      total,
      compliant,
      nonCompliant,
      pending,
      inProgress,
      complianceRate: total > 0 ? Math.round((compliant / total) * 100) : 0
    };
  };

  const stats = getComplianceStats();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Ofsted Compliance Management</h1>
        <button
          onClick={handleAddRequirement}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-1" />
          Add Requirement
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-md p-3">
              <ClipboardCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Compliance Rate</h3>
              <p className="text-2xl font-semibold text-green-600">{stats.complianceRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-md p-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Non-Compliant</h3>
              <p className="text-2xl font-semibold text-red-600">{stats.nonCompliant}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-md p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Pending Review</h3>
              <p className="text-2xl font-semibold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-md p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total Requirements</h3>
              <p className="text-2xl font-semibold text-blue-600">{stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {categories.map(category => {
            const categoryRequirements = requirements.filter(r => r.category === category);
            const isExpanded = expandedCategories.includes(category);

            return (
              <div key={category} className="mb-4 last:mb-0">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
                    <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-800">
                      {categoryRequirements.length}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-4 space-y-4 pl-4">
                    {categoryRequirements.map(requirement => (
                      <div
                        key={requirement.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{requirement.title}</h3>
                            <p className="mt-1 text-sm text-gray-500">{requirement.description}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            requirement.status === 'compliant'
                              ? 'bg-green-100 text-green-800'
                              : requirement.status === 'non-compliant'
                              ? 'bg-red-100 text-red-800'
                              : requirement.status === 'pending-review'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {requirement.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
                          <div>
                            <p>Last Review: {new Date(requirement.lastReviewDate).toLocaleDateString()}</p>
                            <p>Next Review: {new Date(requirement.nextReviewDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p>Evidence: {requirement.evidence.length} documents</p>
                            <p>Actions: {requirement.actions.length} pending</p>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => handleEditRequirement(requirement)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                    {categoryRequirements.length === 0 && (
                      <p className="text-sm text-gray-500 italic">No requirements added for this category</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <ComplianceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveRequirement}
          initialData={selectedRequirement}
          categories={categories}
        />
      )}
    </div>
  );
};

export default ComplianceManagement;