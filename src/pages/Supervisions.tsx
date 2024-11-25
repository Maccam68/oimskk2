import React, { useState } from 'react';
import { ClipboardList, Calendar, CheckCircle, Clock, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import SupervisionModal from '../components/SupervisionModal';
import { Supervision, SupervisionFormData } from '../types/supervision';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: string;
}

const Supervisions = () => {
  const [supervisions, setSupervisions] = useLocalStorage<Supervision[]>('supervisions', []);
  const [staffMembers] = useLocalStorage<StaffMember[]>('staffMembers', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupervision, setSelectedSupervision] = useState<Supervision | null>(null);
  const [expandedStaff, setExpandedStaff] = useState<number[]>([]);

  const toggleStaffSupervisions = (staffId: number) => {
    setExpandedStaff(prev =>
      prev.includes(staffId)
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleAddSupervision = () => {
    setSelectedSupervision(null);
    setIsModalOpen(true);
  };

  const handleEditSupervision = (supervision: Supervision) => {
    setSelectedSupervision(supervision);
    setIsModalOpen(true);
  };

  const handleDeleteSupervision = (supervisionId: number) => {
    if (window.confirm('Are you sure you want to delete this supervision entry?')) {
      setSupervisions(prev => prev.filter(s => s.id !== supervisionId));
    }
  };

  const handleClearAllSupervisions = () => {
    if (window.confirm('Are you sure you want to delete ALL supervision entries? This cannot be undone.')) {
      setSupervisions([]);
      setExpandedStaff([]);
    }
  };

  const handleSaveSupervision = (formData: SupervisionFormData) => {
    if (selectedSupervision) {
      setSupervisions(prevSupervisions =>
        prevSupervisions.map(supervision =>
          supervision.id === selectedSupervision.id
            ? { ...formData, id: supervision.id, status: supervision.status }
            : supervision
        )
      );
    } else {
      const newSupervision: Supervision = {
        ...formData,
        id: Math.max(0, ...supervisions.map(s => s.id)) + 1,
        status: 'scheduled'
      };
      setSupervisions([...supervisions, newSupervision]);
    }
    setIsModalOpen(false);
  };

  const groupedSupervisions = supervisions.reduce((acc, supervision) => {
    const staffId = supervision.staffId;
    if (!acc[staffId]) {
      acc[staffId] = [];
    }
    acc[staffId].push(supervision);
    return acc;
  }, {} as Record<number, Supervision[]>);

  const getStaffSupervisionStats = (staffId: number) => {
    const staffSupervisions = groupedSupervisions[staffId] || [];
    const completed = staffSupervisions.filter(s => s.status === 'completed').length;
    const scheduled = staffSupervisions.filter(s => s.status === 'scheduled').length;
    const nextSupervision = staffSupervisions
      .filter(s => s.status === 'scheduled')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

    return { completed, scheduled, nextSupervision };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">Staff Supervisions</h1>
          {supervisions.length > 0 && (
            <button
              onClick={handleClearAllSupervisions}
              className="text-red-600 hover:text-red-900 flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </button>
          )}
        </div>
        <button
          onClick={handleAddSupervision}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Schedule Supervision
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-md p-3">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Upcoming</h3>
              <p className="text-2xl font-semibold text-blue-600">
                {supervisions.filter(s => s.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-md p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Completed</h3>
              <p className="text-2xl font-semibold text-green-600">
                {supervisions.filter(s => s.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-md p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Overdue</h3>
              <p className="text-2xl font-semibold text-yellow-600">
                {supervisions.filter(s => 
                  s.status === 'scheduled' && new Date(s.date) < new Date()
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {staffMembers.map((staff) => {
            const stats = getStaffSupervisionStats(staff.id);
            const isExpanded = expandedStaff.includes(staff.id);
            const staffSupervisions = groupedSupervisions[staff.id] || [];

            return (
              <div key={staff.id} className="border rounded-lg mb-4 last:mb-0">
                <button
                  onClick={() => toggleStaffSupervisions(staff.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{staff.name}</h3>
                    <p className="text-sm text-gray-500">{staff.role}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      Next: {stats.nextSupervision ? new Date(stats.nextSupervision.date).toLocaleDateString() : 'None scheduled'}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t p-4">
                    <div className="space-y-4">
                      {staffSupervisions
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((supervision) => (
                          <div
                            key={supervision.id}
                            className="border rounded p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Supervision on {new Date(supervision.date).toLocaleDateString()}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  Supervisor: {supervision.supervisorName}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  supervision.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : supervision.status === 'scheduled'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {supervision.status.charAt(0).toUpperCase() + supervision.status.slice(1)}
                                </span>
                                <button
                                  onClick={() => handleDeleteSupervision(supervision.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <h5 className="text-sm font-medium text-gray-700">Notes</h5>
                                <p className="text-sm text-gray-600">{supervision.notes}</p>
                              </div>

                              <div>
                                <h5 className="text-sm font-medium text-gray-700">Actions</h5>
                                <ul className="list-disc list-inside text-sm text-gray-600">
                                  {supervision.actions.map((action, index) => (
                                    <li key={index}>{action}</li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h5 className="text-sm font-medium text-gray-700">Outcomes</h5>
                                <ul className="list-disc list-inside text-sm text-gray-600">
                                  {supervision.outcomes.map((outcome, index) => (
                                    <li key={index}>{outcome}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="mt-4 flex justify-end space-x-2">
                              <button
                                onClick={() => handleEditSupervision(supervision)}
                                className="text-indigo-600 hover:text-indigo-900 text-sm"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <SupervisionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSupervision}
        staffMembers={staffMembers}
        initialData={selectedSupervision ? {
          staffId: selectedSupervision.staffId,
          supervisorName: selectedSupervision.supervisorName,
          date: selectedSupervision.date,
          notes: selectedSupervision.notes,
          actions: selectedSupervision.actions,
          outcomes: selectedSupervision.outcomes,
          nextSupervisionDate: selectedSupervision.nextSupervisionDate
        } : undefined}
      />
    </div>
  );
};

export default Supervisions;