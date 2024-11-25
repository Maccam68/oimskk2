import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import TrainingModule from './TrainingModule';
import { TrainingModule as TrainingModuleType } from '../types/training';

interface Props {
  category: string;
  modules: TrainingModuleType[];
  isExpanded: boolean;
  onToggle: () => void;
  onModuleToggle: (moduleId: number) => void;
  expandedModules: number[];
  onAllocateTraining: (module: TrainingModuleType) => void;
}

const TrainingCategory: React.FC<Props> = ({
  category,
  modules,
  isExpanded,
  onToggle,
  onModuleToggle,
  expandedModules,
  onAllocateTraining
}) => {
  return (
    <div className="mb-6 last:mb-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
      >
        <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {modules.map((module) => (
            <TrainingModule
              key={module.id}
              module={module}
              isExpanded={expandedModules.includes(module.id)}
              onToggle={() => onModuleToggle(module.id)}
              onAllocate={() => onAllocateTraining(module)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingCategory;