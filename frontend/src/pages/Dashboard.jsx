import React from 'react';
import { useAuth } from '../context/AuthContext';
import { DocumentIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'User'}!</h1>
        <p className="text-blue-100">Here's your dashboard overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Documents" value="234" icon={DocumentIcon} color="bg-blue-600" />
        <StatCard title="Pending Approvals" value="12" icon={ClockIcon} color="bg-yellow-600" />
        <StatCard title="Team Members" value="45" icon={UserGroupIcon} color="bg-green-600" />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Documents</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-medium">Q4 Report 2024.pdf</p>
              <p className="text-sm text-gray-500">Uploaded by John Doe</p>
            </div>
            <span className="text-sm text-gray-400">2 days ago</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <div>
              <p className="font-medium">Employee Handbook.pdf</p>
              <p className="text-sm text-gray-500">Uploaded by Jane Smith</p>
            </div>
            <span className="text-sm text-gray-400">5 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
