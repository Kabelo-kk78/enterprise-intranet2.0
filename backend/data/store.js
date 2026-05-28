const bcrypt = require('bcryptjs');

const employees = [
  { id: '1', name: 'John Doe', email: 'john@example.com', department: 'Engineering', role: 'admin', status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', department: 'HR', role: 'manager', status: 'active' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', department: 'Finance', role: 'staff', status: 'active' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', department: 'Marketing', role: 'staff', status: 'active' },
  { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', department: 'Engineering', role: 'staff', status: 'active' },
];

const departments = [
  { id: 'd1', name: 'Engineering', headCount: 15 },
  { id: 'd2', name: 'HR', headCount: 8 },
  { id: 'd3', name: 'Finance', headCount: 6 },
  { id: 'd4', name: 'Marketing', headCount: 10 },
  { id: 'd5', name: 'Operations', headCount: 12 },
  { id: 'd6', name: 'IT', headCount: 9 },
];

const activities = [
  { id: 'a1', description: 'Emily Chen uploaded Q4 Financial Report 2025', timestamp: new Date(Date.now() - 172800000).toISOString(), type: 'document', department: 'Finance', user: 'Emily Chen' },
  { id: 'a2', description: 'Sarah Mitchell approved Q4 Financial Report 2025', timestamp: new Date(Date.now() - 259200000).toISOString(), type: 'document', department: 'Finance', user: 'Sarah Mitchell' },
  { id: 'a3', description: 'James Wilson uploaded Employee Handbook v5.2', timestamp: new Date(Date.now() - 432000000).toISOString(), type: 'document', department: 'HR', user: 'James Wilson' },
  { id: 'a4', description: 'Lisa Park submitted for approval Marketing Campaign Brief - Summer', timestamp: new Date(Date.now() - 518400000).toISOString(), type: 'document', department: 'Marketing', user: 'Lisa Park' },
  { id: 'a5', description: 'Kevin Adams rejected Operations Manual Update', timestamp: new Date(Date.now() - 604800000).toISOString(), type: 'document', department: 'Operations', user: 'Kevin Adams' },
  { id: 'a6', description: 'Robert Garcia downloaded Annual Budget Proposal', timestamp: new Date(Date.now() - 691200000).toISOString(), type: 'document', department: 'Finance', user: 'Robert Garcia' },
];

const documents = [
  { id: 'doc1', name: 'Q4 Report 2024.pdf', department: 'Finance', uploadedBy: 'John Doe', date: '2024-01-15', size: '2.4 MB', status: 'approved' },
  { id: 'doc2', name: 'Employee Handbook.pdf', department: 'HR', uploadedBy: 'Jane Smith', date: '2024-01-10', size: '5.1 MB', status: 'approved' },
  { id: 'doc3', name: 'IT Security Policy.pdf', department: 'IT', uploadedBy: 'Mike Johnson', date: '2024-01-05', size: '1.8 MB', status: 'pending' },
  { id: 'doc4', name: 'Marketing Plan 2024.docx', department: 'Marketing', uploadedBy: 'Alice Brown', date: '2024-01-12', size: '3.2 MB', status: 'approved' },
  { id: 'doc5', name: 'Engineering Specs.pdf', department: 'Engineering', uploadedBy: 'Charlie Davis', date: '2024-01-08', size: '4.0 MB', status: 'pending' },
];

const approvals = [
  { id: 'ap1', document: 'Budget 2024.xlsx', requester: 'Sarah Wilson', department: 'Finance', date: '2024-01-14', status: 'pending' },
  { id: 'ap2', document: 'New Hire Request.docx', requester: 'Tom Brown', department: 'HR', date: '2024-01-13', status: 'pending' },
  { id: 'ap3', document: 'Software License Renewal.pdf', requester: 'Mike Johnson', department: 'IT', date: '2024-01-12', status: 'pending' },
  { id: 'ap4', document: 'Marketing Campaign Budget.xlsx', requester: 'Alice Brown', department: 'Marketing', date: '2024-01-11', status: 'approved' },
];

const users = [
  {
    id: 'u1',
    name: 'Super Admin',
    email: 'super@company.com',
    password: bcrypt.hashSync('super123', 10),
    role: 'super_admin',
    department: 'IT',
    position: 'Super Administrator',
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: 'u2',
    name: 'Admin User',
    email: 'admin@company.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    department: 'IT',
    position: 'System Administrator',
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: 'u3',
    name: 'Jane Smith',
    email: 'jane@company.com',
    password: bcrypt.hashSync('jane123', 10),
    role: 'manager',
    department: 'HR',
    position: 'HR Manager',
    status: 'active',
    createdAt: '2024-01-02',
  },
  {
    id: 'u4',
    name: 'Bob Wilson',
    email: 'bob@company.com',
    password: bcrypt.hashSync('bob123', 10),
    role: 'staff',
    department: 'Finance',
    position: 'Financial Analyst',
    status: 'active',
    createdAt: '2024-01-03',
  },
  {
    id: 'u5',
    name: 'Alice Brown',
    email: 'alice@company.com',
    password: bcrypt.hashSync('alice123', 10),
    role: 'staff',
    department: 'Marketing',
    position: 'Marketing Specialist',
    status: 'active',
    createdAt: '2024-01-04',
  },
  {
    id: 'u6',
    name: 'Guest User',
    email: 'guest@company.com',
    password: bcrypt.hashSync('guest123', 10),
    role: 'guest',
    department: 'General',
    position: 'Guest',
    status: 'active',
    createdAt: '2024-01-05',
  },
];

let nextUserNum = 7;
let nextDocNum = 6;
let nextApprovalNum = 5;
let nextActivityNum = 7;

function addUser(userData) {
  const id = 'u' + (nextUserNum++);
  const user = { id, ...userData, password: bcrypt.hashSync(userData.password, 10), status: 'active', createdAt: new Date().toISOString().split('T')[0] };
  users.push(user);
  return { id, name: user.name, email: user.email, role: user.role, department: user.department, position: user.position, status: 'active' };
}

function findUserByEmail(email) {
  return users.find(u => u.email === email);
}

function findUserById(id) {
  return users.find(u => u.id === id);
}

function getUsers() {
  return users.map(({ password, ...u }) => u);
}

function addDocument(docData) {
  const id = 'doc' + (nextDocNum++);
  const doc = { id, ...docData, date: new Date().toISOString().split('T')[0] };
  documents.push(doc);
  return doc;
}

function addActivity(description, type, department, user) {
  const id = 'a' + (nextActivityNum++);
  const activity = { id, description, timestamp: new Date().toISOString(), type };
  if (department) activity.department = department;
  if (user) activity.user = user;
  activities.unshift(activity);
  return activity;
}

function nextApprovalId() {
  return 'ap' + (nextApprovalNum++);
}

module.exports = {
  employees, departments, activities, documents, approvals, users,
  addUser, findUserByEmail, findUserById, getUsers,
  addDocument, addActivity, nextApprovalId,
};
