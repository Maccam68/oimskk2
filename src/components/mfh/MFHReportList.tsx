import React from 'react';
import { Clock, MapPin, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

interface MFHReport {
  id: number;
  name: string;
  age: number;
  lastSeen: string;
  location: string;
  status: 'active' | 'resolved';
  riskLevel: 'high' | 'medium' | 'low';
  returnDate?: string;
  returnLocation?: string;
}

interface Props {
  reports: MFHReport[];
  onMarkReturned: (report: MFHReport) => void;
  onDelete: (id: number) => void;
  onViewDetails: (report: MFHReport) => void;
}

const MFHReportList: React.FC<Props> = ({
  reports,
  onMarkReturned,
  onDelete,
  onViewDetails
}) => {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div
          key={report.id}
          className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(report.riskLevel)}`}>
                  {report.riskLevel.toUpperCase()}
                </span>
                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                  report.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {report.status.toUpperCase()}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">Age: {report.age}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onViewDetails(report)}
                className="text-indigo-600 hover:text-indigo-900 text-sm"
              >
                View Details
              </button>
              {report.status === 'active' && (
                <button
                  onClick={() => onMarkReturned(report)}
                  className="text-green-600 hover:text-green-900 text-sm"
                >
                  Mark as Returned
                </button>
              )}
              <button
                onClick={() => onDelete(report.id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-2" />
              Last seen: {new Date(report.lastSeen).toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-2" />
              {report.location}
            </div>
          </div>

          {report.status === 'resolved' && (
            <div className="mt-4 bg-gray-50 p-3 rounded-md">
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Returned: {new Date(report.returnDate!).toLocaleString()}
              </div>
              {report.returnLocation && (
                <div className="mt-1 flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  Found at: {report.returnLocation}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {reports.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No reports found
        </div>
      )}
    </div>
  );
};

export default MFHReportList;