import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fixGoogleCalendarJs() {
  const filePath = path.join(__dirname, 'src', 'lib', 'google-calendar.js');

  const content = `
import { useEffect, useState } from 'react';

let tokenClient;

export const useGoogleAuth = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/calendar.readonly',
          callback: (response) => {
            if (response.access_token) {
              setIsSignedIn(true);
            }
          },
        });
      } else {
        console.error('Google API not loaded');
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const signIn = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      console.error('Token client not initialized');
    }
  };

  return { signIn, isSignedIn };
};

export const listEvents = () => {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(new Error('Not authenticated'));
      return;
    }

    tokenClient.requestAccessToken({ prompt: '' });
    tokenClient.callback = async (response) => {
      if (response.error !== undefined) {
        reject(new Error(response.error));
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
        const processedEvents = data.items.map((event) => ({
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
};
`;

  try {
    await fs.writeFile(filePath, content, 'utf8');
    console.log('google-calendar.js has been successfully updated!');
  } catch (error) {
    console.error('Error updating google-calendar.js:', error);
  }
}

fixGoogleCalendarJs();
