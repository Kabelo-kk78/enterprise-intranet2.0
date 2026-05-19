import React, { useState, useEffect, useRef } from 'react';
import { DocumentIcon, ArrowUpTrayIcon, MagnifyingGlassIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchDocs = () => {
    api.get('/documents').then(res => { setDocuments(res.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowUpload(false);
      fetchDocs();
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || 'Unknown error'));
    } finally { setUploading(false); }
  };

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

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" placeholder="Search documents..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
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
                  <button onClick={() => handleDownload(doc)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Download
                  </button>
                </td>
              </tr>
            ))}
            {filteredDocs.length === 0 && (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No documents found.</td></tr>
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
