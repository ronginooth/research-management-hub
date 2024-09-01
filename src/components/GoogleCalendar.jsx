import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { initializeGoogleApi, handleSignIn, handleSignOut, listCalendars, listUpcomingEvents } from '../utils/googleCalendarApi';

const GoogleCalendar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState('');
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeGoogleApi();
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize Google API:', error);
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const onSignIn = async () => {
    try {
      await handleSignIn();
      const calendarList = await listCalendars();
      setCalendars(calendarList);
      setIsSignedIn(true);
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  const onSignOut = () => {
    handleSignOut();
    setIsSignedIn(false);
    setCalendars([]);
    setSelectedCalendar('');
    setEvents([]);
  };

  const handleCalendarChange = async (calendarId) => {
    setSelectedCalendar(calendarId);
    const calendarEvents = await listUpcomingEvents(calendarId);
    setEvents(calendarEvents);
  };

  if (isLoading) {
    return <div>Loading Google API...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        {!isSignedIn ? (
          <Button onClick={onSignIn}>Sign in with Google</Button>
        ) : (
          <>
            <Button onClick={onSignOut} variant="outline">Sign Out</Button>
            <Select value={selectedCalendar} onValueChange={handleCalendarChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a calendar" />
              </SelectTrigger>
              <SelectContent>
                {calendars.map((calendar) => (
                  <SelectItem key={calendar.id} value={calendar.id}>
                    {calendar.summary}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
              <ul className="space-y-2">
                {events.map((event) => (
                  <li key={event.id} className="border-b pb-2">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleCalendar;
