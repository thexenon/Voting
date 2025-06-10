import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchItems } from '../services/api';

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = localStorage.getItem('userUID');
  const userRole = localStorage.getItem('userrole');
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const allEvents = await fetchItems('events').then(
          (res) => res.data.data.data
        );

        const userEvents = allEvents.filter(
          (event) => event.coordinator === currentUser
        );

        if (userRole == 'superadmin') {
          setEvents(allEvents);
        } else {
          setEvents(userEvents);
        }
      } catch (err) {
        setError('Failed to load events.');
      }
      setLoading(false);
    };
    if (currentUser) {
      loadEvents();
    }
  }, [currentUser]);

  const handleAddNew = () => {
    navigate('/add-new/event');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My Events</h1>
          <Link
            to="../add-new/event"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors duration-200"
          >
            + Add New
          </Link>
        </div>
        {loading && <div className="text-gray-500">Loading events...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && (
          <div>
            {events.length === 0 ? (
              <div className="text-gray-500">
                No events found for this user.
              </div>
            ) : (
              <ul className="space-y-6">
                {events.map((event) => (
                  <li
                    key={event.id}
                    className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-6 cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
                    onClick={() =>
                      navigate(`/add-new/editevent?id=${event.id || event._id}`)
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
                      <div className="mb-2 text-gray-700">
                        {event.description}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex">
                          <span className="font-medium capitalize mr-2">
                            Cost per Vote :
                          </span>
                          <span>{event.price}</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium capitalize mr-2">
                            Slug :
                          </span>
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Event;
