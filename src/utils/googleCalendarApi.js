import { gapi } from 'gapi-script';

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

export const initializeGoogleApi = () => {
  return new Promise((resolve, reject) => {
    gapi.load('client', async () => {
      try {
        await initializeGapiClient();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};

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

export const gisLoaded = () => {
  try {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
  } catch (error) {
    console.error('Error initializing Google Identity Services:', error);
  }
};

const maybeEnableButtons = () => {
  if (gapiInited && gisInited) {
    document.dispatchEvent(new Event('gapi-loaded'));
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
        reject(new Error(resp.error));
        return;
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
    throw new Error('GAPI client not initialized');
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
    throw error;
  }
};

export const loadGoogleApi = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      gapi.load('client', async () => {
        try {
          await initializeGoogleApi();
          const gisScript = document.createElement('script');
          gisScript.src = 'https://accounts.google.com/gsi/client';
          gisScript.onload = () => {
            gisLoaded();
            resolve();
          };
          gisScript.onerror = () => reject(new Error('Failed to load Google Identity Services'));
          document.body.appendChild(gisScript);
        } catch (error) {
          reject(error);
        }
      });
    };
    script.onerror = () => reject(new Error('Failed to load Google API'));
    document.body.appendChild(script);
  });
};
