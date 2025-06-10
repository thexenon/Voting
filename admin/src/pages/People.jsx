import React, { useEffect, useState } from 'react';
import { fetchItems, deleteItem } from '../services/api';
import { useNavigate } from 'react-router-dom';

const People = () => {
  const [categories, setCategories] = useState([]);
  const [nominees, setNominees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = localStorage.getItem('userUID');
  const userRole = localStorage.getItem('userrole');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const [catRes, nomRes] = await Promise.all([
          fetchItems('categories'),
          fetchItems('nominees'),
        ]);
        const allCategories = catRes.data.data.data;
        const allNominees = nomRes.data.data.data;
        // Only categories created by current user
        const userCategories = allCategories.filter(
          (cat) => cat.coordinator === currentUser
        );
        userRole === 'superadmin'
          ? setCategories(allCategories)
          : setCategories(userCategories);
        setNominees(allNominees);
      } catch {
        setError('Failed to load nominees or categories.');
      }
      setLoading(false);
    };
    loadData();
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this nominee?'))
      return;
    try {
      const item = nominees.find((n) => n.id === id || n._id === id);
      await deleteItem(item, 'nominees');
      setNominees((prev) => prev.filter((n) => n.id !== id && n._id !== id));
      alert('Nominee deleted successfully.');
    } catch (err) {
      alert('Failed to delete nominee.');
    }
  };

  if (loading) {
    return (
      <div className="text-center text-lg text-gray-500 py-8">
        Loading nominees...
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }
  if (categories.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">No categories found.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-0">
            Nominees by Category
          </h1>
          <button
            onClick={() => navigate('/add-new/people')}
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors duration-200"
          >
            + Add New
          </button>
        </div>
        {categories.map((cat) => {
          const catNominees = nominees.filter(
            (nom) => nom.category === cat.id || nom.category === cat._id
          );
          return (
            <div key={cat.id || cat._id} className="mb-10">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">
                {cat.name}
              </h2>
              {catNominees.length === 0 ? (
                <div className="text-gray-500 mb-4">
                  No nominees in this category.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {catNominees.map((nom) => (
                    <div
                      key={nom.id || nom._id}
                      className="bg-white rounded-lg shadow p-6 flex flex-col gap-2 relative cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
                      onClick={() =>
                        navigate(`/add-new/editpeople?id=${nom.id || nom._id}`)
                      }
                    >
                      <div className="flex items-center gap-4 mb-2">
                        {nom.image && (
                          <img
                            src={nom.image}
                            alt={nom.name}
                            className="w-20 h-20 object-cover rounded-full border"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {nom.name}
                          </h3>
                          <div className="text-gray-600 text-sm">
                            Votes: {nom.votes}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(nom.id || nom._id);
                          }}
                          className="ml-auto text-red-600 hover:text-red-800 text-xs font-bold px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="text-gray-600 text-sm mb-1">
                        <span className="font-medium">Description:</span>{' '}
                        {nom.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default People;
