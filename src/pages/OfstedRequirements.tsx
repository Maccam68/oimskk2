import React from 'react';
import { AlertCircle } from 'lucide-react';
import OfstedRequirementsForm from '../components/compliance/OfstedRequirementsForm';

const OfstedRequirements = () => {
  const handleSubmit = async (data: any) => {
    try {
      console.log('Submitted requirements:', data);
    } catch (error) {
      console.error('Error saving requirements:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Ofsted Requirements</h1>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Track and manage Ofsted requirements and standards. Use this checklist to ensure compliance with all necessary regulations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <OfstedRequirementsForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default OfstedRequirements;