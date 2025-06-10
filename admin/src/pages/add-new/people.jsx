import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchItems } from '../../services/api';
import { submitPost } from '../../services/user_api';

const CLOUDINARY_UPLOAD_PRESET = 'Server Images';
const CLOUDINARY_CLOUD_NAME = 'du0sqginv';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const initialState = {
  name: '',
  description: '',
  image: '',
  event: '',
  coordinator: localStorage.getItem('userUID'),
  category: '',
};

const AddNominee = () => {
  const [form, setForm] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('userUID');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const allCategories = await fetchItems('categories').then(
          (res) => res.data.data.data
        );
        const userCategories = allCategories.filter(
          (cat) => cat.coordinator === currentUser
        );
        setCategories(userCategories);
      } catch {
        setCategories([]);
      }
    };
    const loadEvents = async () => {
      try {
        const allEvents = await fetchItems('events').then(
          (res) => res.data.data.data
        );
        const userEvents = allEvents.filter(
          (cat) => cat.coordinator === currentUser
        );
        setEvents(userEvents);
      } catch {
        setEvents([]);
      }
    };
    loadCategories();
    loadEvents();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return '';
    const data = new FormData();
    data.append('file', imageFile);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    data.append('folder', 'Voting/nominee-images');
    setLoading(true);
    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      return result.secure_url;
    } catch (err) {
      setError('Image upload failed.');
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    let imageUrl = form.image;
    if (imageFile) {
      imageUrl = await uploadImage();
      if (!imageUrl) {
        setLoading(false);
        return;
      }
    }
    try {
      await submitPost({ ...form, image: imageUrl }, 'nominees').then(
        (result) => {
          if (result.status === 200 || result.status === 201) {
            setLoading(false);
            navigate('/people');
          } else {
            setError(result.message);
            setLoading(false);
          }
        }
      );
    } catch (err) {
      setError('Failed to add nominee.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Nominee</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nominee Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nominee Name"
            required
            minLength={10}
            maxLength={60}
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
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id || cat._id} value={cat.id || cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Nominee Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="mt-2 h-40 rounded border object-contain"
            />
          )}
        </div>

        {loading && <div className="text-blue-600">Uploading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-2 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading...' : 'Add Nominee'}
        </button>
      </form>
    </div>
  );
};

export default AddNominee;
