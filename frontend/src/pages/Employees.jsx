import React, { useState } from 'react';

const Employees = () => {
  const [employees] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', department: 'IT', role: 'Developer' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'HR', role: 'Manager' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', department: 'Sales', role: 'Representative' },
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Employees Directory</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employees;
