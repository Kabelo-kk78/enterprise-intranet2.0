import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const statusColors = {
  approved: '#22c55e',
  pending: '#eab308',
  rejected: '#ef4444',
};

const deptChartColors = ['#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ef4444', '#eab308', '#ec4899'];

export default function Reports() {
  const [data, setData] = useState({ stats: null, documents: [], departments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/stats').catch(() => ({ data: null })),
      api.get('/documents').catch(() => ({ data: [] })),
      api.get('/departments/stats').catch(() => ({ data: { list: [] } })),
    ]).then(([statsRes, docsRes, deptsRes]) => {
      setData({
        stats: statsRes.data,
        documents: docsRes.data || [],
        departments: deptsRes.data?.list || [],
      });
      setLoading(false);
    });
  }, []);

  const byDepartment = {};
  const byStatus = { approved: 0, pending: 0, rejected: 0 };

  data.documents.forEach(d => {
    byDepartment[d.department] = (byDepartment[d.department] || 0) + 1;
    if (byStatus[d.status] !== undefined) byStatus[d.status]++;
  });

  const deptBarData = Object.entries(byDepartment)
    .filter(([, count]) => count > 0)
    .map(([name, count], i) => ({
      name,
      count,
      color: deptChartColors[i % deptChartColors.length],
    }));

  const statusPieData = Object.entries(byStatus)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: statusColors[name] || '#6b7280',
    }));

  const totalDocs = data.stats?.totalDocuments || data.documents.length;
  const deptsWithDocs = Object.keys(byDepartment).length;

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">Loading reports...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">Total Documents</p>
          <p className="text-3xl font-bold text-gray-900">{totalDocs}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">Approved</p>
          <p className="text-3xl font-bold text-green-600">{byStatus.approved || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{byStatus.pending || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">Departments with Docs</p>
          <p className="text-3xl font-bold text-purple-600">{deptsWithDocs}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents by Department</h2>
          {deptBarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptBarData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50}>
                  {deptBarData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No documents uploaded yet.</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Status</h2>
          {statusPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                  {statusPieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-sm text-gray-600">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No document status data.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h2>
          {data.documents.length > 0 ? (
            <div className="space-y-4">
              {Object.entries(byDepartment)
                .sort(([, a], [, b]) => b - a)
                .map(([dept, count], i) => (
                <div key={dept} className="flex items-center">
                  <span className="w-32 text-sm text-gray-600">{dept}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5">
                    <div
                      className="h-5 rounded-full transition-all duration-500"
                      style={{
                        width: `${(count / data.documents.length) * 100}%`,
                        backgroundColor: deptChartColors[i % deptChartColors.length],
                      }}
                    />
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700 min-w-[3rem] text-right">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No documents uploaded yet.</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Departments Overview</h2>
          {data.departments.length > 0 ? (
            <div className="space-y-3">
              {data.departments.map(d => (
                <div key={d.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-800 font-medium">{d.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{d.documentCount || 0} documents</span>
                    <span className="text-sm text-gray-400">{d.headCount} members</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No departments data.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Documents</h2>
        {data.documents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{doc.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{doc.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{doc.uploadedBy}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{doc.date}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                        doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {doc.status ? doc.status.charAt(0).toUpperCase() + doc.status.slice(1) : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No documents uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
