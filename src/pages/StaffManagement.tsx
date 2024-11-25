import React, { useState } from 'react';
import { User, Phone, Mail, MapPin } from 'lucide-react';
import StaffModal from '../components/StaffModal';
import useLocalStorage from '../hooks/useLocalStorage';
import { StaffMember } from '../types/staff';

const initialStaffMembers: StaffMember[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Senior Care Worker',
    email: 'sarah.j@example.com',
    phone: '07700 900123',
    location: 'Unit A',
    status: 'active',
    startDate: '2023-01-15',
    emergencyContact: '',
    dbs: 'DBS123456',
    qualifications: [],
    employmentHistory: [],
    references: []
  }
];

const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useLocalStorage<StaffMember[]>('staffMembers', initialStaffMembers);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSave = (updatedStaff: StaffMember) => {
    setStaffMembers(staffMembers.map(staff => 
      staff.id === updatedStaff.id ? updatedStaff : staff
    ));
    setIsModalOpen(false);
  };

  const handleDeactivate = (id: number) => {
    setStaffMembers(staffMembers.map(staff => 
      staff.id === id 
        ? { ...staff, status: staff.status === 'active' ? 'inactive' : 'active' }
        : staff
    ));
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      setStaffMembers(staffMembers.filter(staff => staff.id !== id));
      setIsModalOpen(false);
    }
  };

  const handleAddStaff = () => {
    const newStaff: StaffMember = {
      id: Math.max(0, ...staffMembers.map(s => s.id)) + 1,
      name: '',
      role: '',
      email: '',
      phone: '',
      location: '',
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      emergencyContact: '',
      dbs: '',
      qualifications: [],
      employmentHistory: [],
      references: []
    };
    setSelectedStaff(newStaff);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSaveNewStaff = (newStaff: StaffMember) => {
    setStaffMembers([...staffMembers, newStaff]);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Staff Management</h1>
        <button 
          onClick={handleAddStaff}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add New Staff
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4">
            {staffMembers.map((staff) => (
              <div
                key={staff.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{staff.name}</h3>
                      <p className="text-sm text-gray-500">{staff.role}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-2" />
                    {staff.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-2" />
                    {staff.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {staff.location}
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => handleViewDetails(staff)}
                    className="text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleEdit(staff)}
                    className="text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeactivate(staff.id)}
                    className="text-sm text-yellow-600 hover:text-yellow-900"
                  >
                    {staff.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    onClick={() => handleDelete(staff.id)}
                    className="text-sm text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedStaff && (
        <StaffModal
          staff={selectedStaff}
          isOpen={isModalOpen}
          mode={modalMode}
          onClose={() => setIsModalOpen(false)}
          onSave={modalMode === 'edit' && selectedStaff.id === Math.max(...staffMembers.map(s => s.id)) + 1 
            ? handleSaveNewStaff 
            : handleSave}
          onDeactivate={handleDeactivate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default StaffManagement;