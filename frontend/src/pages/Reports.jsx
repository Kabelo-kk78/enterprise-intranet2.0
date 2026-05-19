import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Reports() {
  const [data, setData] = useState({ documents: [], activities: [], departments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/documents').catch(() => ({ data: [] })),
      api.get('/activities/recent').catch(() => ({ data: [] })),
      api.get('/departments/stats').catch(() => ({ data: { list: [] } })),
    ]).then(([docs, acts, depts]) => {
      setData({ documents: docs.data, activities: acts.data, departments: depts.data.list });
      setLoading(false);
    });
  }, []);

  const byDepartment = {};
  data.documents.forEach(d => {
    byDepartment[d.department] = (byDepartment[d.department] || 0) + 1;
  });

  const byStatus = {};
  data.documents.forEach(d => {
    byStatus[d.status] = (byStatus[d.status] || 0) + 1;
  });

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">Loading reports...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Total Documents</p>
          <p className="text-3xl font-bold text-gray-900">{data.documents.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Approved</p>
          <p className="text-3xl font-bold text-green-600">{byStatus.approved || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{byStatus.pending || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Departments</p>
          <p className="text-3xl font-bold text-blue-600">{data.departments.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents by Department</h2>
          <div className="space-y-3">
            {Object.entries(byDepartment).map(([dept, count]) => (
              <div key={dept} className="flex items-center">
                <span className="w-32 text-sm text-gray-600">{dept}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-4">
                  <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${(count / data.documents.length) * 100}%` }} />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Departments</h2>
          <div className="space-y-3">
            {data.departments.map(d => (
              <div key={d.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-800">{d.name}</span>
                <span className="text-sm text-gray-500">{d.headCount} members</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        {data.activities.length > 0 ? (
          <div className="space-y-3">
            {data.activities.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-800">{a.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(a.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent activity.</p>
        )}
      </div>
    </div>
  );
}
