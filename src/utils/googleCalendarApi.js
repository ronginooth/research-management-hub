import { gapi } from 'gapi-script';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

const initializeGapiClient = async () => {
  try {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
  } catch (error) {
    console.error('Error initializing GAPI client:', error);
    throw error;
  }
};

const gisLoaded = () => {
  if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
  } else {
    console.error('Google Identity Services not loaded');
  }
};

const maybeEnableButtons = () => {
  if (gapiInited && gisInited) {
    console.log('Google APIs initialized');
  }
};

export const handleAuthClick = () => {
  if (!tokenClient) {
    console.error('Token client not initialized');
    return Promise.reject(new Error('Token client not initialized'));
  }

  return new Promise((resolve, reject) => {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        reject(resp);
      }
      try {
        const events = await listUpcomingEvents();
        resolve(events);
      } catch (error) {
        reject(error);
      }
    };

    if (gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
      tokenClient.requestAccessToken({prompt: ''});
    }
  });
};

export const handleSignoutClick = () => {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
  }
};

export const listUpcomingEvents = async () => {
  if (!gapi.client) {
    console.error('GAPI client not initialized');
    return [];
  }

  try {
    const response = await gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime',
    });

    const events = response.result.items;
    if (!events || events.length === 0) {
      return [];
    }
    return events.map((event) => ({
      id: event.id,
      title: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
    }));
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
};

export const loadGoogleApi = () => {
  return new Promise((resolve, reject) => {
    const loadGapiScript = () => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        gapi.load('client', async () => {
          try {
            await initializeGapiClient();
            loadGisScript();
          } catch (error) {
            reject(error);
          }
        });
      };
      script.onerror = () => reject(new Error('Failed to load GAPI script'));
      document.body.appendChild(script);
    };

    const loadGisScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        gisLoaded();
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load GIS script'));
      document.body.appendChild(script);
    };

    loadGapiScript();
  });
};
