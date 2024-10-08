const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

export const initializeGoogleApi = async () => {
  await loadGapiClient();
  await loadGisClient();
};

const loadGapiClient = () => {
  return new Promise((resolve, reject) => {
    gapi.load('client', async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};

const loadGisClient = () => {
  return new Promise((resolve) => {
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredentialResponse,
    });
    gisInited = true;
    resolve();
  });
};

const handleCredentialResponse = (response) => {
  if (response.credential) {
    const token = response.credential;
    gapi.client.setToken({ access_token: token });
  }
};

export const handleSignIn = (silent = false) => {
  return new Promise((resolve, reject) => {
    if (!gapiInited || !gisInited) {
      reject(new Error('Google API not initialized'));
      return;
    }

    if (gapi.client.getToken() === null) {
      if (silent) {
        resolve(false);
        return;
      }
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          reject(new Error('Consent skipped or not displayed'));
        }
      });
    } else {
      resolve(true);
    }
  });
};

export const handleSignOut = () => {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.id.revoke(token.access_token, () => {
      gapi.client.setToken('');
    });
  }
};

export const listCalendars = async () => {
  try {
    const response = await gapi.client.calendar.calendarList.list();
    return response.result.items;
  } catch (error) {
    console.error('Error fetching calendars:', error);
    return [];
  }
};

export const listUpcomingEvents = async (calendarId = 'primary') => {
  try {
    const response = await gapi.client.calendar.events.list({
      'calendarId': calendarId,
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
