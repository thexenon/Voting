import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitPost } from '../../services/user_api';

const CLOUDINARY_UPLOAD_PRESET = 'Server Images';
const CLOUDINARY_CLOUD_NAME = 'du0sqginv';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const initialState = {
  name: '',
  description: '',
  date: '',
  duration: '',
  price: '',
  coordinator: localStorage.getItem('userUID'),
  image: '',
  // ...add other fields from your event model as needed...
};

const AddEvent = () => {
  const [form, setForm] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    data.append('folder', 'Voting/event-images');
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
      await submitPost({ ...form, image: imageUrl }, 'events').then(
        (result) => {
          if (result.status == 200 || result.status == 201) {
            setLoading(false);
            navigate('/event');
          } else {
            setError(result.message);
            setLoading(false);
          }
        }
      );
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name of Event</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name of Event"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description of Event</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description of Event"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Date of Event</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            placeholder="Date of Event"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Duration of Event</label>
          <input
            type="datetime-local"
            name="duration"
            placeholder="Duration of Event"
            value={form.duration}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Cost per Vote</label>
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Cost per Vote"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        {/* Add more fields as per your event model */}
        <div>
          <label className="block mb-1 font-medium">Event Image</label>
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
          {loading ? 'Uploading...' : 'Add Event'}
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
