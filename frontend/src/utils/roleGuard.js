// frontend/src/utils/roleGuard.js
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  GUEST: 'guest',
};

export const rolePermissions = {
  [ROLES.SUPER_ADMIN]: ['all'],
  [ROLES.ADMIN]: ['manage_users', 'manage_documents', 'view_logs', 'manage_approvals'],
  [ROLES.MANAGER]: ['approve_documents', 'view_documents', 'upload_documents'],
  [ROLES.STAFF]: ['upload_documents', 'view_own_documents', 'download_documents'],
  [ROLES.GUEST]: ['view_documents', 'download_documents'],
};

export const hasPermission = (userRole, requiredPermission) => {
  if (userRole === ROLES.SUPER_ADMIN) return true;
  const permissions = rolePermissions[userRole] || [];
  return permissions.includes(requiredPermission) || permissions.includes('all');
};