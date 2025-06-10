import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchItems } from '../../services/api';
import { submitUpdate } from '../../services/user_api';

const CLOUDINARY_UPLOAD_PRESET = 'Server Images';
const CLOUDINARY_CLOUD_NAME = 'du0sqginv';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const EditEvent = () => {
  const location = useLocation();
  const id = new URLSearchParams(location.search).get('id');
  const [form, setForm] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      setError('');
      try {
        const allEvents = await fetchItems('events').then(
          (res) => res.data.data.data
        );
        const event = allEvents.find((e) => String(e.id) === String(id));
        if (event) setForm(event);
        else setError('Event not found.');
      } catch {
        setError('Failed to load event.');
      }
      setLoading(false);
    };
    loadEvent();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return form.image;
    const data = new FormData();
    data.append('file', imageFile);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    data.append('folder', 'Voting/event-images');
    setLoading(true);
    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      return result.secure_url;
    } catch {
      setError('Image upload failed.');
      return form.image;
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
      await submitUpdate({ ...form, image: imageUrl }, `events/${id}`).then(
        (result) => {
          if (result.status === 200 || result.status === 201) {
            setLoading(false);
            navigate('/event');
          } else {
            setError('Failed to update event.');
          }
        }
      );
    } catch {
      setError('Failed to update event.');
      setLoading(false);
    }
  };

  if (loading && !form) return <div className="p-6">Loading...</div>;
  if (error && !form) return <div className="p-6 text-red-500">{error}</div>;
  if (!form) return null;

  return (
    <div className="max-w-xl mx-auto p-6 min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name of Event</label>
          <input
            name="name"
            value={form.name || ''}
            onChange={handleChange}
            placeholder="Name of Event"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Date of Event</label>
          <input
            type="date"
            name="date"
            value={form.date ? form.date.slice(0, 10) : ''}
            onChange={handleChange}
            placeholder="Date of Event"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Duration for Votes</label>
          <input
            type="datetime-local"
            name="duration"
            value={form.duration ? form.duration.slice(0, 16) : ''}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Cost per Vote</label>
          <input
            name="price"
            type="number"
            value={form.price || ''}
            onChange={handleChange}
            placeholder="Cost per Vote"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description of Event</label>
          <textarea
            name="description"
            value={form.description || ''}
            onChange={handleChange}
            placeholder="Description of Event"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Event Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {(imageFile || form.image) && (
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : form.image}
              alt="Preview"
              className="mt-2 h-40 rounded border object-contain"
            />
          )}
        </div>

        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-2 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading...' : 'Update Event'}
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
