import React from 'react';
import { Users, GraduationCap, AlertTriangle, ClipboardList } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import { TrainingModule } from '../types/training';
import { Supervision } from '../types/supervision';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: string;
}

const Dashboard = () => {
  const [staffMembers] = useLocalStorage<StaffMember[]>('staffMembers', []);
  const [trainingModules] = useLocalStorage<TrainingModule[]>('trainingModules', []);
  const [supervisions] = useLocalStorage<Supervision[]>('supervisions', []);
  const [missingPersons] = useLocalStorage<any[]>('missingPersons', []);

  const activeStaff = staffMembers.filter(staff => staff.status === 'active').length;
  const trainingCompliance = trainingModules.length > 0 
    ? Math.round((trainingModules.reduce((acc, curr) => acc + (curr.completedBy / curr.totalStaff), 0) / trainingModules.length) * 100)
    : 0;
  const activeMissingPersons = missingPersons.filter(report => report.status === 'active').length;
  const pendingSupervisions = supervisions.filter(s => s.status === 'scheduled').length;

  const recentActivities = [
    ...staffMembers.map(staff => ({
      type: 'staff',
      icon: Users,
      text: `${staff.name} - ${staff.role}`,
      timestamp: new Date().toISOString() // In a real app, you'd store timestamps for each action
    })),
    ...supervisions.map(supervision => ({
      type: 'supervision',
      icon: ClipboardList,
      text: `Supervision scheduled for ${new Date(supervision.date).toLocaleDateString()}`,
      timestamp: supervision.date
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const upcomingTasks = supervisions
    .filter(s => s.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const stats = [
    {
      title: 'Total Staff',
      value: activeStaff.toString(),
      icon: Users,
      change: '',
      changeType: 'neutral'
    },
    {
      title: 'Training Compliance',
      value: `${trainingCompliance}%`,
      icon: GraduationCap,
      change: '',
      changeType: 'neutral'
    },
    {
      title: 'Missing Person Reports',
      value: activeMissingPersons.toString(),
      icon: AlertTriangle,
      change: '',
      changeType: 'neutral'
    },
    {
      title: 'Pending Supervisions',
      value: pendingSupervisions.toString(),
      icon: ClipboardList,
      change: '',
      changeType: 'neutral'
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
              <dt>
                <div className="absolute bg-indigo-500 rounded-md p-3">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                  {item.title}
                </p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              </dd>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Activities</h2>
          <div className="mt-4 space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-800">{activity.text}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">No recent activities</p>
            )}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Tasks</h2>
          <div className="mt-4 space-y-4">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((supervision, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <ClipboardList className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-800">
                      Staff supervision - {staffMembers.find(s => s.id === supervision.staffId)?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Due {new Date(supervision.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No upcoming tasks</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;