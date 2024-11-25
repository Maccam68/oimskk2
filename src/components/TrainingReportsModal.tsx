import React, { useState } from 'react';
import { X, Download, FileText } from 'lucide-react';
import { TrainingModule } from '../types/training';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: string;
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
  trainingModules: TrainingModule[];
  staffMembers: StaffMember[];
  allocations: TrainingAllocation[];
}

const TrainingReportsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  trainingModules,
  staffMembers,
  allocations
}) => {
  const [selectedReport, setSelectedReport] = useState('staff-training');
  const [selectedStaff, setSelectedStaff] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: new Date().toISOString().split('T')[0]
  });

  const categories = Array.from(new Set(trainingModules.map(m => m.category)));

  const generateReport = () => {
    let reportData = [];
    const filteredAllocations = allocations.filter(allocation => {
      const module = trainingModules.find(m => m.id === allocation.moduleId);
      const withinDateRange = (!dateRange.start || (allocation.completionDate && allocation.completionDate >= dateRange.start)) &&
                             (!dateRange.end || (allocation.completionDate && allocation.completionDate <= dateRange.end));
      const matchesCategory = selectedCategory === 'all' || module?.category === selectedCategory;
      const matchesStaff = selectedStaff === 'all' || allocation.staffId === selectedStaff;
      
      return withinDateRange && matchesCategory && matchesStaff;
    });

    switch (selectedReport) {
      case 'staff-training':
        reportData = staffMembers.map(staff => {
          const staffAllocations = filteredAllocations.filter(a => a.staffId === staff.id);
          return {
            name: staff.name,
            role: staff.role,
            completed: staffAllocations.filter(a => a.status === 'completed').length,
            inProgress: staffAllocations.filter(a => a.status === 'in_progress').length,
            notStarted: staffAllocations.filter(a => a.status === 'not_started').length,
            completionRate: `${Math.round((staffAllocations.filter(a => a.status === 'completed').length / 
              (staffAllocations.length || 1)) * 100)}%`
          };
        });
        break;

      case 'course-completion':
        reportData = trainingModules
          .filter(module => selectedCategory === 'all' || module.category === selectedCategory)
          .map(module => {
            const moduleAllocations = filteredAllocations.filter(a => a.moduleId === module.id);
            return {
              title: module.title,
              category: module.category,
              completed: moduleAllocations.filter(a => a.status === 'completed').length,
              total: moduleAllocations.length,
              completionRate: `${Math.round((moduleAllocations.filter(a => a.status === 'completed').length / 
                (moduleAllocations.length || 1)) * 100)}%`
            };
          });
        break;

      case 'category-summary':
        reportData = categories.map(category => {
          const categoryModules = trainingModules.filter(m => m.category === category);
          const categoryAllocations = filteredAllocations.filter(a => 
            categoryModules.some(m => m.id === a.moduleId)
          );
          return {
            category,
            totalModules: categoryModules.length,
            totalAllocations: categoryAllocations.length,
            completed: categoryAllocations.filter(a => a.status === 'completed').length,
            completionRate: `${Math.round((categoryAllocations.filter(a => a.status === 'completed').length / 
              (categoryAllocations.length || 1)) * 100)}%`
          };
        });
        break;
    }

    // Convert to CSV and download
    const headers = Object.keys(reportData[0] || {});
    const csv = [
      headers.join(','),
      ...reportData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `training-report-${selectedReport}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Training Reports</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Report Type</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="staff-training">Staff Training Status</option>
              <option value="course-completion">Course Completion Rates</option>
              <option value="category-summary">Category Summary</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Staff Member</label>
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="all">All Staff</option>
                {staffMembers.map(staff => (
                  <option key={staff.id} value={staff.id}>{staff.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Training Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={generateReport}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
            >
              <Download className="h-5 w-5 mr-2" />
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingReportsModal;