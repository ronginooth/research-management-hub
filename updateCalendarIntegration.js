import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateFiles() {
  const dashboardPath = path.join(__dirname, 'src', 'components', 'Dashboard.jsx');
  const calendarPath = path.join(__dirname, 'src', 'lib', 'google-calendar.js');

  try {
    // Update Dashboard.jsx
    let dashboardContent = await fs.readFile(dashboardPath, 'utf8');

    // Add useCallback import if not present
    if (!dashboardContent.includes('useCallback')) {
      dashboardContent = dashboardContent.replace(
        'import React, { useState, useEffect } from \'react\';',
        'import React, { useState, useEffect, useCallback } from \'react\';'
      );
    }

    // Update fetchEvents function
    const newFetchEvents = `
  const fetchEvents = useCallback(async () => {
    try {
      setCalendarError(null);
      const calendarEvents = await listEvents();
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setCalendarError('カレンダーイベントの取得に失敗しました。');
    }
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      fetchEvents();
    }
  }, [isSignedIn, fetchEvents]);`;

    dashboardContent = dashboardContent.replace(
      /const fetchEvents = async \(\) => \{[\s\S]*?\};[\s\S]*?useEffect\(\(\) => \{[\s\S]*?\}, \[isSignedIn\]\);/,
      newFetchEvents
    );

    await fs.writeFile(dashboardPath, dashboardContent, 'utf8');
    console.log('Dashboard.jsx has been successfully updated!');

    // Update google-calendar.js
    let calendarContent = await fs.readFile(calendarPath, 'utf8');

    // Update listEvents function
    const newListEvents = `
export const listEvents = async () => {
  if (!tokenClient) {
    throw new Error('Not authenticated');
  }

  return new Promise((resolve, reject) => {
    tokenClient.requestAccessToken({ prompt: '' });
    tokenClient.callback = async (response) => {
      if (response.error !== undefined) {
        reject(response);
        return;
      }
      try {
        const now = new Date();
        const timeMin = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const timeMax = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30).toISOString();
        
        const fetchResponse = await fetch(
          \`https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=100&orderBy=startTime&singleEvents=true&timeMin=\${timeMin}&timeMax=\${timeMax}\`,
          {
            headers: {
              Authorization: \`Bearer \${response.access_token}\`,
            },
          }
        );

        if (!fetchResponse.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await fetchResponse.json();
        const processedEvents = data.items.map(event => ({
          ...event,
          isAllDay: Boolean(event.start.date),
          start: event.start.dateTime || event.start.date,
          end: event.end.dateTime || event.end.date,
        }));
        resolve(processedEvents);
      } catch (error) {
        console.error('Error fetching calendar events:', error);
        reject(error);
      }
    };
  });
};`;

    calendarContent = calendarContent.replace(
      /export const listEvents = async \(\) => \{[\s\S]*?\};/,
      newListEvents
    );

    await fs.writeFile(calendarPath, calendarContent, 'utf8');
    console.log('google-calendar.js has been successfully updated!');

  } catch (error) {
    console.error('Error updating files:', error);
  }
}

updateFiles();
