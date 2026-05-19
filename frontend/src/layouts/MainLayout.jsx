import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  DocumentIcon, 
  CheckCircleIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Documents', href: '/documents', icon: DocumentIcon },
  { name: 'Approvals', href: '/approvals', icon: CheckCircleIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        <div className="w-64 bg-white shadow-lg">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h1 className="text-xl font-bold text-gray-800">Enterprise Intranet</h1>
              <p className="text-sm text-gray-600 mt-1">{user?.department || 'Dashboard'}</p>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'Staff'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
