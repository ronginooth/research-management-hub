import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateGoogleCalendarJs() {
  const filePath = path.join(__dirname, 'src', 'lib', 'google-calendar.js');
  
  try {
    // 現在の google-calendar.js の内容を読み込む
    let content = await fs.readFile(filePath, 'utf8');

    // listEvents 関数を更新
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

    // listEvents 関数を置き換え
    content = content.replace(
      /export const listEvents = async \(\) => \{[\s\S]*?\};/,
      newListEvents
    );

    // 更新された内容を書き込む
    await fs.writeFile(filePath, content, 'utf8');
    console.log('google-calendar.js has been successfully updated!');
  } catch (error) {
    console.error('Error updating google-calendar.js:', error);
  }
}

updateGoogleCalendarJs();
