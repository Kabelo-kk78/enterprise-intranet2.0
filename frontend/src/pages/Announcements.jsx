import React, { useState } from 'react';

const Announcements = () => {
  const [announcements] = useState([
    { id: 1, title: 'Company Holiday Party', date: 'Dec 25, 2024', content: 'Join us for the annual holiday celebration!' },
    { id: 2, title: 'New HR Policy', date: 'Dec 20, 2024', content: 'Updated remote work policy effective January 2025' },
    { id: 3, title: 'System Maintenance', date: 'Dec 18, 2024', content: 'Scheduled maintenance on Dec 22, 2 AM - 4 AM' },
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Announcements</h1>
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">{ann.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{ann.date}</p>
            <p className="text-gray-700">{ann.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
