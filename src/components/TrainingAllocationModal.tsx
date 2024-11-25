import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: string;
}

interface TrainingModule {
  id: number;
  title: string;
  mandatory: boolean;
}

interface TrainingAllocation {
  staffId: number;
  moduleId: number;
  status: 'not_started' | 'in_progress' | 'completed';
  startDate?: string;
  completionDate?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  module: TrainingModule;
  staffMembers: StaffMember[];
  existingAllocations: TrainingAllocation[];
  onSaveAllocations: (allocations: TrainingAllocation[]) => void;
}

const TrainingAllocationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  module,
  staffMembers,
  existingAllocations,
  onSaveAllocations,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allocations, setAllocations] = useState<TrainingAllocation[]>(existingAllocations);

  const filteredStaff = staffMembers.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    staff.status === 'active'
  );

  const handleStatusChange = (staffId: number, status: TrainingAllocation['status']) => {
    const now = new Date().toISOString();
    setAllocations(prev => {
      const existingIndex = prev.findIndex(a => a.staffId === staffId && a.moduleId === module.id);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          status,
          completionDate: status === 'completed' ? now : undefined
        };
        return updated;
      }

      return [...prev, {
        staffId,
        moduleId: module.id,
        status,
        startDate: now,
        completionDate: status === 'completed' ? now : undefined
      }];
    });
  };

  const handleSave = () => {
    onSaveAllocations(allocations);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Allocate Training: {module.title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search staff members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="mt-4 max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((staff) => {
                const allocation = allocations.find(
                  a => a.staffId === staff.id && a.moduleId === module.id
                );
                
                return (
                  <tr key={staff.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{staff.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={allocation?.status || 'not_started'}
                        onChange={(e) => handleStatusChange(staff.id, e.target.value as TrainingAllocation['status'])}
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Save Allocations
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingAllocationModal;