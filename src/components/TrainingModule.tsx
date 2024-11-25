import React from 'react';
import { Calendar, GraduationCap, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { TrainingModule as TrainingModuleType } from '../types/training';

interface Props {
  module: TrainingModuleType;
  isExpanded: boolean;
  onToggle: () => void;
  onAllocate: () => void;
}

const TrainingModule: React.FC<Props> = ({
  module,
  isExpanded,
  onToggle,
  onAllocate
}) => {
  return (
    <div className="border rounded-lg">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
      >
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-medium text-gray-900">
            {module.title}
            {module.mandatory && (
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                Mandatory
              </span>
            )}
          </h3>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Source: {module.courseSource}
              </span>
              <span className="text-sm text-gray-500">
                Started: {new Date(module.startDate).toLocaleDateString()}
              </span>
            </div>
            <button
              onClick={onAllocate}
              className="flex items-center text-indigo-600 hover:text-indigo-900"
            >
              <Users className="h-5 w-5 mr-1" />
              <span>Allocate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              Due: {new Date(module.dueDate).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <GraduationCap className="h-4 w-4 mr-2" />
              {module.completedBy} of {module.totalStaff} completed
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-2" />
              Progress: {Math.round((module.completedBy / module.totalStaff) * 100)}%
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      module.completedBy === module.totalStaff ? 'bg-green-600' :
                      (module.completedBy / module.totalStaff) >= 0.75 ? 'bg-indigo-600' :
                      (module.completedBy / module.totalStaff) >= 0.5 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${(module.completedBy / module.totalStaff) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {Math.round((module.completedBy / module.totalStaff) * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingModule;