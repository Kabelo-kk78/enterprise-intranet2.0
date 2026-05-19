import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState(null);

  const fetchUsers = () => {
    api.get('/users').then(res => { setUsers(res.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditForm({ name: user.name, role: user.role, department: user.department, position: user.position, status: user.status });
    setMessage(null);
  };

  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const saveEdit = async (id) => {
    try {
      await api.put(`/users/${id}`, editForm);
      setMessage('User updated successfully');
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      setMessage('Failed to update user');
    }
  };

  const roleBadge = (role) => {
    const colors = { admin: 'bg-purple-100 text-purple-800', manager: 'bg-blue-100 text-blue-800', staff: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role] || colors.staff}`}>{role}</span>;
  };

  const statusBadge = (status) => {
    const colors = { active: 'bg-green-100 text-green-800', inactive: 'bg-red-100 text-red-800' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.active}`}>{status}</span>;
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">Loading users...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">User Management</h1>

      {message && <div className="p-3 bg-green-100 text-green-800 rounded-lg">{message}</div>}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                {editingId === user.id ? (
                  <>
                    <td className="px-6 py-4"><input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm" /></td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4"><input type="text" value={editForm.department} onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm" /></td>
                    <td className="px-6 py-4">
                      <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                        className="px-2 py-1 border border-gray-300 rounded text-sm">
                        <option value="admin">admin</option>
                        <option value="manager">manager</option>
                        <option value="staff">staff</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                        className="px-2 py-1 border border-gray-300 rounded text-sm">
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => saveEdit(user.id)} className="text-sm text-blue-600 hover:text-blue-800">Save</button>
                      <button onClick={cancelEdit} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4"><span className="text-sm font-medium text-gray-900">{user.name}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.department}</td>
                    <td className="px-6 py-4">{roleBadge(user.role)}</td>
                    <td className="px-6 py-4">{statusBadge(user.status)}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => startEdit(user)} className="text-sm text-blue-600 hover:text-blue-800">Edit</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
