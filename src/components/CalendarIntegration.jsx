import React, { useEffect, useState } from 'react';
import { loadGoogleApi, handleAuthClick, handleSignoutClick } from '../utils/googleCalendarApi';
import { Button } from "@/components/ui/button";

const CalendarIntegration = () => {
  const [events, setEvents] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeGoogleAPI = async () => {
      try {
        await loadGoogleApi();
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize Google API:', error);
        setError('Failed to initialize Google API. Please try again later.');
        setIsLoading(false);
      }
    };

    initializeGoogleAPI();
  }, []);

  const handleAuth = async () => {
    try {
      const calendarEvents = await handleAuthClick();
      setEvents(calendarEvents);
      setIsSignedIn(true);
    } catch (error) {
      console.error('Authentication failed:', error);
      setError('Authentication failed. Please try again.');
    }
  };

  const handleSignout = () => {
    handleSignoutClick();
    setEvents([]);
    setIsSignedIn(false);
    setError(null);
  };

  if (isLoading) {
    return <div className="p-4">Loading Google API...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Google Calendar Integration</h2>
      {!isSignedIn ? (
        <Button onClick={handleAuth}>Authorize</Button>
      ) : (
        <Button onClick={handleSignout} variant="destructive">Sign Out</Button>
      )}
      {events.length > 0 && (
        <ul className="mt-4 space-y-2">
          {events.map(event => (
            <li key={event.id} className="bg-white p-2 rounded shadow">
              <span className="font-semibold">{event.title}</span> - {new Date(event.start).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CalendarIntegration;
