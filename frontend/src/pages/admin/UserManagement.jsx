import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const departmentOptions = ['Engineering', 'HR', 'Finance', 'Marketing', 'Operations', 'IT', 'General'];

export default function UserManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: 'staff', department: 'General', position: 'Staff' });

  useEffect(() => {
    if (!['admin', 'super_admin'].includes(user?.role)) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', addForm);
      setShowAdd(false);
      setAddForm({ name: '', email: '', password: '', role: 'staff', department: 'General', position: 'Staff' });
      setMessage('User created successfully');
      fetchUsers();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to create user');
    }
  };

  const roleBadge = (role) => {
    const colors = { super_admin: 'bg-red-100 text-red-800', admin: 'bg-purple-100 text-purple-800', manager: 'bg-blue-100 text-blue-800', staff: 'bg-gray-100 text-gray-800', guest: 'bg-green-100 text-green-800' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role] || colors.staff}`}>{role}</span>;
  };

  const statusBadge = (status) => {
    const colors = { active: 'bg-green-100 text-green-800', inactive: 'bg-red-100 text-red-800' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.active}`}>{status}</span>;
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <button onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5" />
          Add User
        </button>
      </div>

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
                          <option value="super_admin">super_admin</option>
                          <option value="admin">admin</option>
                          <option value="manager">manager</option>
                          <option value="staff">staff</option>
                          <option value="guest">guest</option>
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

      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add User</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" required value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" required value={addForm.password} onChange={e => setAddForm({ ...addForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select value={addForm.department} onChange={e => setAddForm({ ...addForm, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={addForm.role} onChange={e => setAddForm({ ...addForm, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="guest">Guest</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input type="text" value={addForm.position} onChange={e => setAddForm({ ...addForm, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowAdd(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900">Cancel</button>
                <button type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
