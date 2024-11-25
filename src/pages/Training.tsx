import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import TrainingAllocationModal from '../components/TrainingAllocationModal';
import TrainingCategory from '../components/TrainingCategory';
import AddTrainingModal from '../components/AddTrainingModal';
import TrainingReportsModal from '../components/TrainingReportsModal';
import { TrainingModule, TrainingAllocation } from '../types/training';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: string;
}

const Training = () => {
  const [trainingModules, setTrainingModules] = useLocalStorage<TrainingModule[]>('trainingModules', []);
  const [staffMembers] = useLocalStorage<StaffMember[]>('staffMembers', []);
  const [allocations, setAllocations] = useLocalStorage<TrainingAllocation[]>('trainingAllocations', []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedModules, setExpandedModules] = useState<number[]>([]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleAllocateTraining = (module: TrainingModule) => {
    setSelectedModule(module);
    setIsAllocationModalOpen(true);
  };

  const handleSaveAllocations = (newAllocations: TrainingAllocation[]) => {
    setAllocations(newAllocations);
    
    if (selectedModule) {
      const completedCount = newAllocations.filter(
        a => a.moduleId === selectedModule.id && a.status === 'completed'
      ).length;

      setTrainingModules(modules => 
        modules.map(m => 
          m.id === selectedModule.id 
            ? { ...m, completedBy: completedCount }
            : m
        )
      );
    }
  };

  const handleAddModule = (moduleData: Omit<TrainingModule, 'id'>) => {
    const newId = Math.max(0, ...trainingModules.map(m => m.id)) + 1;
    const newModule: TrainingModule = {
      ...moduleData,
      id: newId,
    };
    setTrainingModules([...trainingModules, newModule]);
    setIsAddModalOpen(false);
  };

  const groupedModules = trainingModules.reduce((acc, module) => {
    const category = module.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(module);
    return acc;
  }, {} as Record<string, TrainingModule[]>);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Training Management</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsReportsModalOpen(true)}
            className="bg-white text-indigo-600 px-4 py-2 rounded-md border border-indigo-600 hover:bg-indigo-50 flex items-center"
          >
            <FileText className="h-5 w-5 mr-2" />
            Reports
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add Training Module
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {Object.entries(groupedModules).map(([category, modules]) => (
            <TrainingCategory
              key={category}
              category={category}
              modules={modules}
              isExpanded={expandedCategories.includes(category)}
              onToggle={() => toggleCategory(category)}
              onModuleToggle={toggleModule}
              expandedModules={expandedModules}
              onAllocateTraining={handleAllocateTraining}
            />
          ))}
        </div>
      </div>

      <AddTrainingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddModule}
      />

      {selectedModule && (
        <TrainingAllocationModal
          isOpen={isAllocationModalOpen}
          onClose={() => setIsAllocationModalOpen(false)}
          module={selectedModule}
          staffMembers={staffMembers}
          existingAllocations={allocations.filter(a => a.moduleId === selectedModule.id)}
          onSaveAllocations={handleSaveAllocations}
        />
      )}

      <TrainingReportsModal
        isOpen={isReportsModalOpen}
        onClose={() => setIsReportsModalOpen(false)}
        trainingModules={trainingModules}
        staffMembers={staffMembers}
        allocations={allocations}
      />
    </div>
  );
};

export default Training;