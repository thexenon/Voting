import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchItems } from '../services/api';
import { deleteItem } from '../services/api';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    fetchItems('users')
      .then((data) => {
        const allUsers = data.data.data.data;
        const filteredUsers = allUsers.filter(
          (u) => u.id !== currentUser?.id && u._id !== currentUser?.id
        );
        setUsers(filteredUsers);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load users');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const item = users.find((u) => u.id === id || u._id === id);
      await deleteItem(item, 'users');
      setUsers((prev) => prev.filter((u) => u.id !== id && u._id !== id));
      alert('User deleted successfully.');
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">All Users</h1>
          <Link
            to="/add-new/admin"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors duration-200"
          >
            + Add New
          </Link>
        </div>
        {loading ? (
          <div className="text-center text-lg text-gray-500">
            Loading users...
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-500">No users found.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow p-6 flex flex-col cursor-pointer hover:shadow-lg transition-shadow relative"
                onClick={() => navigate(`/add-new/editadmin?id=${user.id}`)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter')
                    navigate(`/add-new/editadmin?id=${user.id}`);
                }}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {user.name}
                </h2>
                <div className="text-sm text-blue-600 mb-2">
                  {user.role || 'User'}
                </div>
                <div className="text-gray-600 mb-2">
                  {user.email || user.contact}
                </div>
                <div className="text-xs text-gray-400">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleString()
                    : ''}
                </div>
                <button
                  className="absolute top-4 right-4 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded shadow"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(user.id);
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
