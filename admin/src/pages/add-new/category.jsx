import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchItems } from '../../services/api';
import { submitPost } from '../../services/user_api';

const initialState = {
  name: '',
  minVote: '',
  description: '',
  award: '',
  event: '',
  coordinator: localStorage.getItem('userUID'),
  active: true,
};

const AddCategory = () => {
  const [form, setForm] = useState(initialState);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('userUID');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const allEvents = await fetchItems('events').then(
          (res) => res.data.data.data
        );
        const userEvents = allEvents.filter(
          (event) => event.coordinator === currentUser
        );
        setEvents(userEvents);
      } catch {
        setEvents([]);
      }
    };
    loadEvents();
  }, [currentUser]);

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
      await submitPost({ ...form }, 'categories').then((result) => {
        if (result.status === 200 || result.status === 201) {
          setLoading(false);
          navigate('/category');
        } else {
          setError(result.message);
          setLoading(false);
        }
      });
    } catch (err) {
      setError('Failed to add category.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Add New Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Category Name</label>
          <input
            name="name"
            value={form.name}
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
            value={form.minVote}
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
            value={form.description}
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
            value={form.award}
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
            value={form.event}
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

        {loading && <div className="text-blue-600">Uploading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-2 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading...' : 'Add Category'}
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
