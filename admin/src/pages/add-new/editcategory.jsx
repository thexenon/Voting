import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchItems } from '../../services/api';
import { submitUpdate } from '../../services/user_api';

const EditCategory = () => {
  const location = useLocation();
  const id = new URLSearchParams(location.search).get('id');
  const [form, setForm] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('userUID');

  useEffect(() => {
    const loadCategoryAndEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const [catRes, eventRes] = await Promise.all([
          fetchItems('categories'),
          fetchItems('events'),
        ]);
        const allCategories = catRes.data.data.data;
        const allEvents = eventRes.data.data.data;
        const category = allCategories.find(
          (c) => String(c.id || c._id) === String(id)
        );
        setForm(category);
        const userEvents = allEvents.filter(
          (event) => event.coordinator === currentUser
        );
        setEvents(userEvents);
      } catch {
        setError('Failed to load category or events.');
      }
      setLoading(false);
    };
    loadCategoryAndEvents();
  }, [id, currentUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await submitUpdate({ ...form }, `categories/${id}`).then((result) => {
        if (result.status === 200 || result.status === 201) {
          setLoading(false);
          navigate('/category');
        } else {
          setError(result.message);
          setLoading(false);
        }
      });
    } catch (err) {
      setError('Failed to update category.');
      setLoading(false);
    }
  };

  if (loading && !form) return <div className="p-6">Loading...</div>;
  if (error && !form) return <div className="p-6 text-red-500">{error}</div>;
  if (!form) return null;

  return (
    <div className="max-w-xl mx-auto p-6 min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Category Name</label>
          <input
            name="name"
            value={form.name || ''}
            onChange={handleChange}
            placeholder="Category Name"
            required
            minLength={10}
            maxLength={60}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Minimum Votes</label>
          <input
            name="minVote"
            type="number"
            value={form.minVote || ''}
            onChange={handleChange}
            placeholder="Minimum Votes"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={form.description || ''}
            onChange={handleChange}
            placeholder="Description"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Award</label>
          <input
            name="award"
            value={form.award || ''}
            onChange={handleChange}
            placeholder="Award for Winner"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Event</label>
          <select
            name="event"
            value={form.event || ''}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event.id || event._id} value={event.id || event._id}>
                {event.name || event.title}
              </option>
            ))}
          </select>
        </div>

        {loading && <div className="text-blue-600">Saving...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-2 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Update Category'}
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
