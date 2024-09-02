import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fixDashboardJsx() {
  const filePath = path.join(__dirname, 'src', 'components', 'Dashboard.jsx');
  let content = await fs.readFile(filePath, 'utf8');

  const newRenderUpcomingEvents = `
  const renderUpcomingEvents = () => {
    return events.slice(0, 10).map(event => {
      const startTime = utcToZonedTime(new Date(event.start.dateTime || event.start.date), 'Asia/Tokyo');
      const endTime = utcToZonedTime(new Date(event.end.dateTime || event.end.date), 'Asia/Tokyo');
      const formattedTimeRange = event.isAllDay 
        ? '終日' 
        : \`\${format(startTime, 'HH:mm', { timeZone: 'Asia/Tokyo' })}-\${format(endTime, 'HH:mm', { timeZone: 'Asia/Tokyo' })}\`;

      return (
        <div key={event.id} className="mb-2">
          <span className="font-semibold">{event.summary}</span> - {format(startTime, 'yyyy/MM/dd', { timeZone: 'Asia/Tokyo' })} {formattedTimeRange}
        </div>
      );
    });
  };`;

  // 既存の renderUpcomingEvents 関数を新しいものに置き換える
  content = content.replace(
    /const renderUpcomingEvents = \(\) => \{[\s\S]*?\};/,
    newRenderUpcomingEvents
  );

  await fs.writeFile(filePath, content, 'utf8');
  console.log('Dashboard.jsx has been successfully updated with the fixed renderUpcomingEvents function!');
}

fixDashboardJsx();
