import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function Approvals() {
  const [approvals, setApprovals] = useState([
    { id: 1, document: 'Budget 2024.xlsx', requester: 'Sarah Wilson', department: 'Finance', date: '2024-01-14' },
    { id: 2, document: 'New Hire Request.docx', requester: 'Tom Brown', department: 'HR', date: '2024-01-13' },
  ]);

  const handleApprove = (id) => {
    setApprovals(approvals.filter(a => a.id !== id));
    alert('Document approved!');
  };

  const handleReject = (id) => {
    setApprovals(approvals.filter(a => a.id !== id));
    alert('Document rejected');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
      <div className="grid gap-4">
        {approvals.map((approval) => (
          <div key={approval.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-2">{approval.document}</h3>
                <p className="text-sm text-gray-600">Requester: {approval.requester}</p>
                <p className="text-sm text-gray-600">Department: {approval.department}</p>
                <p className="text-sm text-gray-600">Date: {approval.date}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleApprove(approval.id)} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4" />
                  Approve
                </button>
                <button onClick={() => handleReject(approval.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2">
                  <XCircleIcon className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
