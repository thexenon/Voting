import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchItems, deleteItem } from '../services/api';
import { use } from 'react';

const Category = () => {
  const [categories, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userRole = localStorage.getItem('userrole');
  const currentUser = localStorage.getItem('userUID');

  const handleDelete = async (id) => {
    if (
      !window.confirm('Are you sure you want to delete this categories item?')
    )
      return;
    try {
      // Find the item object by id
      const item = categories.find((n) => n.id === id || n._id === id);
      // Get the cookie string for jwt or token
      await deleteItem(item, 'categories');
      setExpandedId(null); // Collapse any expanded item
      alert('Category item deleted successfully.');
      setCategory((prev) =>
        prev.filter((item) => item.id !== id && item._id !== id)
      );
    } catch (err) {
      alert('Failed to delete categories item.');
    }
  };

  useEffect(() => {
    fetchItems('categories')
      .then((data) => {
        const allCategories = data.data.data.data;
        const userCategories = allCategories.filter(
          (cat) => cat.coordinator === currentUser
        );

        if (userRole === 'superadmin') {
          setCategory(allCategories);
        } else {
          setCategory(userCategories);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load categories');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Categories</h1>
          <Link
            to="../add-new/category"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors duration-200"
          >
            + Add New
          </Link>
        </div>
        {loading ? (
          <div className="text-center text-lg text-gray-500">
            Loading categories...
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-500">No categories found.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id || cat._id}
                className="bg-white rounded-lg shadow p-6 flex flex-col gap-2 relative cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
                onClick={() =>
                  (window.location.href = `/add-new/editcategory?id=${
                    cat.id || cat._id
                  }`)
                }
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {cat.name}
                  </h2>
                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(cat.id || cat._id);
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-bold"
                  >
                    Delete
                  </button> */}
                </div>
                <div className="text-gray-600 text-sm mb-1">
                  <span className="font-medium">Description:</span>{' '}
                  {cat.description}
                </div>
                <div className="text-gray-600 text-sm mb-1">
                  <span className="font-medium">Award:</span> {cat.award}
                </div>
                <div className="text-gray-600 text-sm mb-1">
                  <span className="font-medium">Min Votes:</span> {cat.minVote}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
