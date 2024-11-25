import React, { useState } from 'react';
import { UserSearch, Clock, MapPin, Phone, CheckCircle, Plus, X, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import useLocalStorage from '../hooks/useLocalStorage';
import MFHReportList from '../components/mfh/MFHReportList';
import ReturnHomeForm from '../components/mfh/ReturnHomeForm';

interface MFHReport {
  id: number;
  name: string;
  age: number;
  lastSeen: string;
  location: string;
  status: 'active' | 'resolved';
  riskLevel: 'high' | 'medium' | 'low';
  description: string;
  contactInfo: string;
  returnDate?: string;
  returnLocation?: string;
  returnCircumstances?: string;
  foundBy?: string;
  physicalCondition?: string;
  mentalState?: string;
  followUpActions?: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const MissingPersons = () => {
  const [reports, setReports] = useLocalStorage<MFHReport[]>('mfhReports', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<MFHReport | null>(null);
  const [isReturnFormOpen, setIsReturnFormOpen] = useState(false);
  const [selectedForReturn, setSelectedForReturn] = useState<MFHReport | null>(null);
  const [formData, setFormData] = useState<Partial<MFHReport>>({
    name: '',
    age: 0,
    lastSeen: new Date().toISOString().slice(0, 16),
    location: '',
    status: 'active',
    riskLevel: 'medium',
    description: '',
    contactInfo: ''
  });

  const activeReports = reports.filter(r => r.status === 'active');
  const resolvedReports = reports.filter(r => r.status === 'resolved');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReport) {
      setReports(reports.map(report => 
        report.id === selectedReport.id ? { ...report, ...formData } : report
      ));
    } else {
      const newReport: MFHReport = {
        ...formData as MFHReport,
        id: Math.max(0, ...reports.map(r => r.id)) + 1,
        status: 'active'
      };
      setReports([...reports, newReport]);
    }
    setIsModalOpen(false);
    setSelectedReport(null);
    setFormData({
      name: '',
      age: 0,
      lastSeen: new Date().toISOString().slice(0, 16),
      location: '',
      status: 'active',
      riskLevel: 'medium',
      description: '',
      contactInfo: ''
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  const handleMarkReturned = (report: MFHReport) => {
    setSelectedForReturn(report);
    setIsReturnFormOpen(true);
  };

  const handleReturnSubmit = (returnData: {
    returnDate: string;
    returnLocation: string;
    returnCircumstances: string;
    foundBy: string;
    physicalCondition: string;
    mentalState: string;
    followUpActions: string[];
  }) => {
    if (selectedForReturn) {
      setReports(reports.map(report =>
        report.id === selectedForReturn.id
          ? {
              ...report,
              ...returnData,
              status: 'resolved'
            }
          : report
      ));
    }
    setIsReturnFormOpen(false);
    setSelectedForReturn(null);
  };

  // Chart data
  const riskLevelData = [
    { name: 'High Risk', value: reports.filter(r => r.riskLevel === 'high').length },
    { name: 'Medium Risk', value: reports.filter(r => r.riskLevel === 'medium').length },
    { name: 'Low Risk', value: reports.filter(r => r.riskLevel === 'low').length }
  ];

  const statusData = [
    { name: 'Active', value: activeReports.length },
    { name: 'Resolved', value: resolvedReports.length }
  ];

  const averageResponseTime = resolvedReports.length > 0
    ? Math.round(resolvedReports.reduce((acc, report) => {
        const lastSeen = new Date(report.lastSeen);
        const returnDate = new Date(report.returnDate!);
        return acc + (returnDate.getTime() - lastSeen.getTime()) / (1000 * 60);
      }, 0) / resolvedReports.length)
    : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">MFH Reports</h1>
        <button 
          onClick={() => {
            setSelectedReport(null);
            setIsModalOpen(true);
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Report
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-md p-3">
              <UserSearch className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Active Cases</h3>
              <p className="text-2xl font-semibold text-red-600">{activeReports.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-md p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Average Response Time</h3>
              <p className="text-2xl font-semibold text-yellow-600">{averageResponseTime}m</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-md p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Resolved Cases</h3>
              <p className="text-2xl font-semibold text-green-600">{resolvedReports.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Level Distribution</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={riskLevelData}
              cx={200}
              cy={150}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {riskLevelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Case Status Overview</h3>
          <BarChart width={400} height={300} data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">Active Reports</h2>
          <MFHReportList
            reports={activeReports}
            onMarkReturned={handleMarkReturned}
            onDelete={handleDelete}
            onViewDetails={(report) => {
              setSelectedReport(report);
              setFormData(report);
              setIsModalOpen(true);
            }}
          />
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900">Resolved Reports</h2>
          <MFHReportList
            reports={resolvedReports}
            onMarkReturned={handleMarkReturned}
            onDelete={handleDelete}
            onViewDetails={(report) => {
              setSelectedReport(report);
              setFormData(report);
              setIsModalOpen(true);
            }}
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedReport ? 'Edit MFH Report' : 'New MFH Report'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Seen</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.lastSeen}
                    onChange={(e) => setFormData({ ...formData, lastSeen: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Risk Level</label>
                  <select
                    required
                    value={formData.riskLevel}
                    onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as MFHReport['riskLevel'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location Last Seen</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Information</label>
                <input
                  type="text"
                  required
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  {selectedReport ? 'Update' : 'Create'} Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isReturnFormOpen && (
        <ReturnHomeForm
          isOpen={isReturnFormOpen}
          onClose={() => {
            setIsReturnFormOpen(false);
            setSelectedForReturn(null);
          }}
          onSubmit={handleReturnSubmit}
        />
      )}
    </div>
  );
};

export default MissingPersons;