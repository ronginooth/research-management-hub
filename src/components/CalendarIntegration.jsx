import React, { useEffect, useState } from 'react';
import { loadGoogleApi, handleAuthClick, handleSignoutClick, listUpcomingEvents } from '../utils/googleCalendarApi';
import { Button } from "@/components/ui/button";

const CalendarIntegration = () => {
  const [events, setEvents] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeGoogleApi = async () => {
      try {
        await loadGoogleApi();
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize Google API:', error);
        setError('Failed to load Google API. Please try again later.');
        setIsLoading(false);
      }
    };

    initializeGoogleApi();
  }, []);

  const handleAuth = async () => {
    try {
      setIsLoading(true);
      await handleAuthClick();
      const calendarEvents = await listUpcomingEvents();
      setEvents(calendarEvents);
      setIsSignedIn(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Authentication failed:', error);
      setError('Authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSignout = () => {
    handleSignoutClick();
    setEvents([]);
    setIsSignedIn(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
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
