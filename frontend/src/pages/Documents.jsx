import React, { useState, useEffect, useRef } from 'react';
import { DocumentIcon, ArrowUpTrayIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, FunnelIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const statusOptions = ['All', 'Approved', 'Pending', 'Rejected'];
const departmentOptions = ['All', 'HR', 'Finance', 'Marketing', 'Engineering', 'IT', 'Operations'];

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadDept, setUploadDept] = useState('');
  const [uploadAssignee, setUploadAssignee] = useState('');
  const fileInputRef = useRef(null);

  const fetchDocs = () => {
    api.get('/documents').then(res => { setDocuments(res.data); setLoading(false); }).catch(() => setLoading(false));
  };

  const fetchEmployees = () => {
    api.get('/users/employees').then(res => setEmployees(res.data || [])).catch(() => {});
  };

  useEffect(() => { fetchDocs(); fetchEmployees(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    if (uploadDept) formData.append('department', uploadDept);
    if (uploadAssignee) formData.append('assignedTo', uploadAssignee);
    try {
      await api.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowUpload(false);
      setUploadDept('');
      setUploadAssignee('');
      fetchDocs();
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || 'Unknown error'));
    } finally { setUploading(false); }
  };

  const handleApprove = async (doc) => {
    setActionLoading(doc.id);
    try {
      await api.post(`/documents/${doc.id}/approve`);
      fetchDocs();
    } catch (err) {
      alert('Failed to approve: ' + (err.response?.data?.error || 'Unknown error'));
    } finally { setActionLoading(null); }
  };

  const handleReject = async (doc) => {
    setActionLoading(doc.id);
    try {
      await api.post(`/documents/${doc.id}/reject`);
      fetchDocs();
    } catch (err) {
      alert('Failed to reject: ' + (err.response?.data?.error || 'Unknown error'));
    } finally { setActionLoading(null); }
  };

  const filteredEmployees = uploadDept
    ? employees.filter(e => e.department === uploadDept)
    : employees;

  const handleDownload = async (doc) => {
    try {
      const response = await api.get(`/documents/${doc.id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Download failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || doc.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesDepartment = departmentFilter === 'All' || doc.department?.toLowerCase() === departmentFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const statusColors = {
    approved: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">Loading documents...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <button onClick={() => setShowUpload(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <ArrowUpTrayIcon className="w-5 h-5" />
          Upload
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search documents..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-gray-400" />
          <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {departmentOptions.map((dept) => (
              <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status === 'All' ? 'All Status' : status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <DocumentIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{doc.department}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{doc.uploadedBy}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{doc.size || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[doc.status] || 'bg-gray-100 text-gray-800'}`}>
                    {doc.status ? doc.status.charAt(0).toUpperCase() + doc.status.slice(1) : '-'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {doc.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(doc)}
                          disabled={actionLoading === doc.id}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center gap-1 disabled:opacity-50">
                          <CheckCircleIcon className="w-3.5 h-3.5" />
                          {actionLoading === doc.id ? '...' : 'Approve'}
                        </button>
                        <button onClick={() => handleReject(doc)}
                          disabled={actionLoading === doc.id}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors flex items-center gap-1 disabled:opacity-50">
                          <XCircleIcon className="w-3.5 h-3.5" />
                          {actionLoading === doc.id ? '...' : 'Reject'}
                        </button>
                      </>
                    )}
                    <button onClick={() => handleDownload(doc)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredDocs.length === 0 && (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No documents found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowUpload(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}>
                <ArrowUpTrayIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to select a file</p>
                <input type="file" ref={fileInputRef} className="hidden" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select value={uploadDept} onChange={(e) => { setUploadDept(e.target.value); setUploadAssignee(''); }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Select department...</option>
                  {departmentOptions.filter(d => d !== 'All').map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to</label>
                <select value={uploadAssignee} onChange={(e) => setUploadAssignee(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Not assigned</option>
                  {filteredEmployees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowUpload(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900">Cancel</button>
                <button type="submit" disabled={uploading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
