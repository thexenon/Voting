import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchItems } from '../services/api';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = localStorage.getItem('userUID');
  const userRole = localStorage.getItem('userrole');
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const allEvents = await fetchItems('events').then(
          (res) => res.data.data.data
        );
        const userEvents =
          userRole === 'superadmin'
            ? allEvents
            : allEvents.filter((event) => event.coordinator === currentUser);
        setEvents(userEvents);
      } catch {
        setError('Failed to load events.');
      }
      setLoading(false);
    };
    loadEvents();
  }, [currentUser, userRole]);

  if (loading) {
    return (
      <div className="text-center text-lg text-gray-500 py-8">
        Loading events...
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }
  if (events.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">No events found.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Events</h1>
        <ul className="space-y-6">
          {events.map((event) => (
            <li
              key={event.id || event._id}
              className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-6 cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
              onClick={() =>
                navigate(`/add-new/event-details?id=${event.id || event._id}`)
              }
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title || 'Event'}
                  className="w-full md:w-48 h-48 object-cover rounded-md border"
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">
                  {event.title || event.name}
                </h2>
                <div className="mb-2 text-gray-700">{event.description}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex">
                    <span className="font-medium capitalize mr-2">
                      Cost per Vote :
                    </span>
                    <span>{event.price}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium capitalize mr-2">Slug :</span>
                    <span>{event.slug}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium capitalize mr-2">
                      Date of Event :
                    </span>
                    <span>{event.duration}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium capitalize mr-2">
                      Duration for Votes :
                    </span>
                    <span>{event.duration}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
