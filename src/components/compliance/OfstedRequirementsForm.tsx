// Update the imports
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { ofstedService } from '../../services/ofstedService';
import { OfstedSection, OfstedRequirement } from '../../types/ofsted';

interface Props {
  onSubmit: (data: any) => void;
}

const OfstedRequirementsForm: React.FC<Props> = ({ onSubmit }) => {
  const [sections, setSections] = useState<OfstedSection[]>([]);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const data = await ofstedService.getAllSections();
      setSections(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load Ofsted requirements');
      setLoading(false);
    }
  };

  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const updateRequirementStatus = async (requirement: OfstedRequirement, status: 'completed' | 'in_progress' | 'not_started') => {
    try {
      await ofstedService.updateRequirementStatus(requirement.id, status);
      await loadSections(); // Reload to get updated data
    } catch (err) {
      setError('Failed to update requirement status');
    }
  };

  const handleEvidenceUpload = async (requirementId: number, file: File) => {
    // TODO: Implement file upload to storage service
    try {
      const fileUrl = 'temporary-url'; // Replace with actual file upload
      await ofstedService.addEvidence(
        requirementId,
        fileUrl,
        file.name,
        1 // Replace with actual user ID
      );
      await loadSections();
    } catch (err) {
      setError('Failed to upload evidence');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection(section.id)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium text-gray-900">{section.title}</span>
            {expandedSections.includes(section.id) ? (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {expandedSections.includes(section.id) && (
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Requirements</h4>
                <div className="space-y-2">
                  {section.requirements.map((requirement) => (
                    <div key={requirement.id} className="flex items-start space-x-4 p-2 rounded-lg hover:bg-gray-50">
                      <select
                        value={requirement.status}
                        onChange={(e) => updateRequirementStatus(requirement, e.target.value as any)}
                        className="rounded-md border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      
                      <div className="flex-grow">
                        <div className="text-sm text-gray-900">{requirement.title}</div>
                        <div className="text-sm text-gray-500">{requirement.description}</div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          id={`evidence-${requirement.id}`}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleEvidenceUpload(requirement.id, file);
                            }
                          }}
                        />
                        <label
                          htmlFor={`evidence-${requirement.id}`}
                          className="cursor-pointer text-indigo-600 hover:text-indigo-900"
                        >
                          <Upload className="h-5 w-5" />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Actions</h4>
                <ul className="list-disc list-inside space-y-1">
                  {section.actions.map((action, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OfstedRequirementsForm;