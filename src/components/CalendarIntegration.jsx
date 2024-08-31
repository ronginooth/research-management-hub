import React, { useEffect, useState } from 'react';
import { loadGoogleApi, handleAuthClick, handleSignoutClick } from '../utils/googleCalendarApi';
import { Button } from "@/components/ui/button";

const CalendarIntegration = () => {
  const [events, setEvents] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    loadGoogleApi();
  }, []);

  const handleAuth = async () => {
    try {
      const calendarEvents = await handleAuthClick();
      setEvents(calendarEvents);
      setIsSignedIn(true);
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const handleSignout = () => {
    handleSignoutClick();
    setEvents([]);
    setIsSignedIn(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Google Calendar Integration</h2>
      {!isSignedIn ? (
        <Button id="authorize_button" onClick={handleAuth}>Authorize</Button>
      ) : (
        <Button onClick={handleSignout}>Sign Out</Button>
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