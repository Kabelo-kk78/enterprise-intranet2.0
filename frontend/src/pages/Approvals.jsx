import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const priorityColors = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function Approvals() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!['manager', 'admin', 'super_admin'].includes(user?.role)) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const fetchApprovals = () => {
    setLoading(true);
    api.get('/approvals')
      .then(res => { setApprovals(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchApprovals(); }, []);

  const tabCounts = {
    All: approvals.length,
    Pending: approvals.filter(a => a.status === 'pending').length,
    Approved: approvals.filter(a => a.status === 'approved').length,
    Rejected: approvals.filter(a => a.status === 'rejected').length,
  };

  const tabs = [
    { name: 'All' },
    { name: 'Pending' },
    { name: 'Approved' },
    { name: 'Rejected' },
  ];

  const filteredApprovals = approvals.filter((a) => {
    return activeTab === 'All' || a.status === activeTab.toLowerCase();
  });

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await api.post(`/approvals/${id}/approve`);
      fetchApprovals();
    } catch (err) {
      alert('Failed to approve: ' + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await api.post(`/approvals/${id}/reject`);
      fetchApprovals();
    } catch (err) {
      alert('Failed to reject: ' + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">Loading approvals...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Approvals</h1>
        <button onClick={fetchApprovals} className="text-sm text-blue-600 hover:text-blue-800">
          Refresh
        </button>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.name
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              {tabCounts[tab.name] > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.name
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tabCounts[tab.name]}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid gap-4">
        {filteredApprovals.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No approvals found</div>
        ) : (
          filteredApprovals.map((approval) => (
            <div key={approval.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-gray-900">{approval.document}</h3>
                    {approval.priority && (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[approval.priority] || 'bg-gray-100 text-gray-800'}`}>
                        {approval.priority}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Requested by <span className="font-medium text-gray-700">{approval.requester}</span></span>
                    <span className="text-gray-300">|</span>
                    <span>{approval.department}</span>
                    <span className="text-gray-300">|</span>
                    <span>{approval.date}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[approval.status] || 'bg-gray-100 text-gray-800'}`}>
                      {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {approval.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(approval.id)}
                        disabled={actionLoading === approval.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        {actionLoading === approval.id ? '...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(approval.id)}
                        disabled={actionLoading === approval.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <XCircleIcon className="w-4 h-4" />
                        {actionLoading === approval.id ? '...' : 'Reject'}
                      </button>
                    </>
                  )}
                  {approval.status === 'approved' && (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-green-700">
                      <CheckCircleIcon className="w-5 h-5" />
                      Approved
                    </span>
                  )}
                  {approval.status === 'rejected' && (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-red-700">
                      <XCircleIcon className="w-5 h-5" />
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
