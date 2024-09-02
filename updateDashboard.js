import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateDashboard() {
  const filePath = path.join(__dirname, 'src', 'components', 'Dashboard.jsx');
  
  try {
    // 現在の Dashboard.jsx の内容を読み込む
    let content = await fs.readFile(filePath, 'utf8');

    // 新しい import を追加
    if (!content.includes("import { format, isToday, isSameDay, parseISO } from 'date-fns';")) {
      content = content.replace(
        "import { format, parseISO, isToday } from 'date-fns';",
        "import { format, isToday, isSameDay, parseISO } from 'date-fns';"
      );
    }
    if (!content.includes("import { Tabs, TabsContent, TabsList, TabsTrigger } from \"@/components/ui/tabs\";")) {
      content = content.replace(
        "import { Button } from \"@/components/ui/button\";",
        "import { Button } from \"@/components/ui/button\";\nimport { Tabs, TabsContent, TabsList, TabsTrigger } from \"@/components/ui/tabs\";"
      );
    }

    // state の更新
    content = content.replace(
      "const [events, setEvents] = useState([]);",
      "const [events, setEvents] = useState([]);\n  const [calendarError, setCalendarError] = useState(null);\n  const [activeTab, setActiveTab] = useState('today');"
    );

    // fetchEvents 関数の更新
    const newFetchEvents = `
  const fetchEvents = async () => {
    try {
      setCalendarError(null);
      const calendarEvents = await listEvents();
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setCalendarError('カレンダーイベントの取得に失敗しました。');
    }
  };`;
    content = content.replace(
      /const fetchEvents = async \(\) => \{[\s\S]*?\};/,
      newFetchEvents
    );

    // 新しい関数を追加
    const newFunctions = `
  const formatEventTime = (event) => {
    if (event.start.date) {
      return '終日';
    }
    const start = new Date(event.start.dateTime);
    const end = new Date(event.end.dateTime);
    return \`\${format(start, 'H:mm')}-\${format(end, 'H:mm')}\`;
  };

  const renderTodayEvents = () => {
    const today = new Date();
    const todayEvents = events.filter(event => 
      isSameDay(parseISO(event.start.dateTime || event.start.date), today)
    );

    return (
      <div className="relative">
        {[...Array(24)].map((_, hour) => (
          <div key={hour} className="flex items-center h-12 border-t">
            <span className="w-12 text-xs text-gray-500">{\`\${hour}:00\`}</span>
            <div className="flex-grow relative">
              {todayEvents.filter(event => {
                const eventStart = new Date(event.start.dateTime || event.start.date);
                return eventStart.getHours() === hour;
              }).map(event => (
                <div key={event.id} className="absolute left-0 right-0 bg-blue-100 p-1 text-xs">
                  {event.summary} ({formatEventTime(event)})
                </div>
              ))}
            </div>
          </div>
        ))}
        <div 
          className="absolute left-12 right-0 border-t border-red-500" 
          style={{ top: \`\${(today.getHours() * 60 + today.getMinutes()) / 1440 * 100}%\` }}
        />
      </div>
    );
  };

  const renderUpcomingEvents = () => {
    return events.slice(0, 10).map(event => (
      <div key={event.id} className="mb-2">
        <span className="font-semibold">{event.summary}</span> - {formatEventTime(event)}
        {event.start.date ? '' : \` \${format(parseISO(event.start.dateTime), 'yyyy/M/d')}\`}
      </div>
    ));
  };

  const renderCalendarEvents = () => {
    if (calendarError) {
      return <p className="text-red-500">{calendarError}</p>;
    }

    if (events.length === 0) {
      return <p>予定されているイベントはありません。</p>;
    }

    return (
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="today">今日の予定</TabsTrigger>
          <TabsTrigger value="upcoming">直近の予定</TabsTrigger>
        </TabsList>
        <TabsContent value="today">{renderTodayEvents()}</TabsContent>
        <TabsContent value="upcoming">{renderUpcomingEvents()}</TabsContent>
      </Tabs>
    );
  };`;

    // 新しい関数を追加
    content = content.replace(
      "return (",
      `${newFunctions}\n\n  return (`
    );

    // Google Calendar Card の更新
    const newCalendarCard = `
      <Card>
        <CardHeader>
          <CardTitle>Google Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          {!isSignedIn ? (
            <Button onClick={signIn}>Sign in with Google</Button>
          ) : (
            <>
              <Button onClick={fetchEvents} className="mb-4">カレンダーを更新</Button>
              {renderCalendarEvents()}
            </>
          )}
        </CardContent>
      </Card>`;
    content = content.replace(
      /<Card>[\s\S]*?<CardHeader>[\s\S]*?<CardTitle>Google Calendar<\/CardTitle>[\s\S]*?<\/CardHeader>[\s\S]*?<CardContent>[\s\S]*?{!isSignedIn[\s\S]*?<\/CardContent>[\s\S]*?<\/Card>/,
      newCalendarCard
    );

    // 更新された内容を書き込む
    await fs.writeFile(filePath, content, 'utf8');
    console.log('Dashboard.jsx has been successfully updated with enhanced calendar features!');
  } catch (error) {
    console.error('Error updating Dashboard.jsx:', error);
  }
}

updateDashboard();