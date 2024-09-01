import { useEffect, useState } from 'react';

export const useGoogleAuth = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);

  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/calendar.readonly',
          callback: (response) => {
            if (response.access_token) {
              setIsSignedIn(true);
            }
          },
        });
        setTokenClient(client);
      } else {
        console.error('Google API not loaded');
      }
    };

    if (document.readyState === 'complete') {
      initializeGoogleAuth();
    } else {
      window.addEventListener('load', initializeGoogleAuth);
      return () => window.removeEventListener('load', initializeGoogleAuth);
    }
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

export const listEvents = async () => {
  try {
    const response = await window.gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    });

    return response.result.items;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};
