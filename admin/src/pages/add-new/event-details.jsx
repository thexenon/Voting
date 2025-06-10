import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchItems } from '../../services/api';

function getTimeLeft(duration) {
  if (!duration) return null;
  const end = new Date(duration).getTime();
  const now = Date.now();
  let diff = end - now;
  if (diff < 0) diff = 0;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

const EventDetails = () => {
  const location = useLocation();
  const id = new URLSearchParams(location.search).get('id');
  const [categories, setCategories] = useState([]);
  const [nominees, setNominees] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const [eventRes, catRes, nomRes] = await Promise.all([
          fetchItems('events'),
          fetchItems('categories'),
          fetchItems('nominees'),
        ]);
        const allEvents = eventRes.data.data.data;
        const allCategories = catRes.data.data.data;
        const allNominees = nomRes.data.data.data;
        const foundEvent = allEvents.find(
          (e) => String(e.id || e._id) === String(id)
        );
        setEvent(foundEvent);
        const eventCategories = allCategories.filter(
          (cat) =>
            cat.event === id ||
            cat.event === foundEvent?.id ||
            cat.event === foundEvent?._id
        );
        setCategories(eventCategories);
        setNominees(allNominees);
        if (foundEvent && foundEvent.duration) {
          setTimeLeft(getTimeLeft(foundEvent.duration));
        }
      } catch {
        setError('Failed to load event details.');
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  useEffect(() => {
    if (!event || !event.duration) return;
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(event.duration));
    }, 1000);
    return () => clearInterval(interval);
  }, [event]);

  if (loading) {
    return (
      <div className="text-center text-lg text-gray-500 py-8">
        Loading event details...
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }
  if (!event) {
    return (
      <div className="text-center text-gray-500 py-8">Event not found.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Countdown Timer */}
        {timeLeft && (
          <div className="mb-6 text-center text-2xl font-bold text-blue-700">
            Time Left for Voting: {timeLeft.days}d {timeLeft.hours}h{' '}
            {timeLeft.minutes}m {timeLeft.seconds}s
          </div>
        )}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {event.title || event.name}
        </h1>
        {/* Total Votes */}
        <div className="mb-6 text-center text-3xl font-extrabold text-green-700">
          Total Votes:{' '}
          {nominees
            .filter((nom) =>
              categories.some(
                (cat) => nom.category === cat.id || nom.category === cat._id
              )
            )
            .reduce((sum, nom) => sum + (Number(nom.votes) || 0), 0)}
        </div>
        <div className="mb-8 text-gray-700">{event.description}</div>
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">
          Categories
        </h2>
        {categories.length === 0 ? (
          <div className="text-gray-500 mb-4">
            No categories for this event.
          </div>
        ) : (
          categories.map((cat) => {
            const catNominees = nominees.filter(
              (nom) => nom.category === cat.id || nom.category === cat._id
            );
            return (
              <div key={cat.id || cat._id} className="mb-8">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  {cat.name}
                </h3>
                {catNominees.length === 0 ? (
                  <div className="text-gray-500 mb-2">
                    No nominees in this category.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {catNominees.map((nom) => (
                      <div
                        key={nom.id || nom._id}
                        className="bg-white rounded-lg shadow p-6 flex flex-col gap-2 relative"
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
                            <h4 className="text-lg font-bold text-gray-800">
                              {nom.name}
                            </h4>
                            <div className="text-gray-600 text-sm">
                              Votes: {nom.votes}
                            </div>
                          </div>
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
          })
        )}
      </div>
    </div>
  );
};

export default EventDetails;
