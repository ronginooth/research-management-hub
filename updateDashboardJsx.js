import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateDashboardJsx() {
  const filePath = path.join(__dirname, 'src', 'components', 'Dashboard.jsx');

  const content = `
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { getTasks, updateTask, addTask } from '../utils/taskDatabase';
import { format, parseISO, isToday, addHours, differenceInMinutes } from 'date-fns';
import { useGoogleAuth, listEvents } from '../lib/google-calendar';

const publicationData = [
  { month: 'Jan', count: 2 },
  { month: 'Feb', count: 1 },
  { month: 'Mar', count: 3 },
  { month: 'Apr', count: 0 },
  { month: 'May', count: 2 },
  { month: 'Jun', count: 1 },
];

export default function Dashboard({ projects = [] }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [events, setEvents] = useState([]);
  const [calendarError, setCalendarError] = useState(null);
  const { signIn, isSignedIn } = useGoogleAuth();
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    setTasks(getTasks());
  }, []);

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
  }, [isSignedIn, fetchEvents]);

  const todayTasks = tasks.filter(task => isToday(parseISO(task.dueDate)));
  const thisWeekTasks = tasks.filter(task => !isToday(parseISO(task.dueDate)));

  const toggleTaskStatus = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status: task.status === '完了' ? '未完了' : '完了' };
        updateTask(updatedTask);
        return updatedTask;
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      const task = addTask({
        name: newTask,
        status: '未完了',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        timeframe: '今日',
      });
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const renderTaskList = (taskList) => (
    <ul className="space-y-2">
      {taskList.length > 0 ? (
        taskList.map(task => (
          <li key={task.id} className="flex items-start space-x-2">
            <Checkbox
              checked={task.status === '完了'}
              onCheckedChange={() => toggleTaskStatus(task.id)}
              className="mt-1"
            />
            <div className="flex-grow">
              <Link to={\`/task/\${task.id}\`} className={\`block \${task.status === '完了' ? 'line-through text-gray-500' : ''}\`}>
                {task.name}
              </Link>
              <div className="text-sm text-gray-500 flex items-center space-x-2 mt-1">
                <span>{task.dueDate}</span>
                {task.project && (
                  <Badge variant="outline" className="ml-2">
                    {projects.find(p => p.id === task.project)?.name || 'Unknown Project'}
                  </Badge>
                )}
              </div>
            </div>
          </li>
        ))
      ) : (
        <li>タスクはありません</li>
      )}
    </ul>
  );

  const renderTodayEvents = () => {
    const now = new Date();
    const tokyoNow = addHours(now, 9); // Convert to Tokyo time
    const todayEvents = events.filter(event => {
      const eventDate = new Date(event.start.dateTime || event.start.date);
      return eventDate.toDateString() === tokyoNow.toDateString();
    });

    const hours = Array.from({ length: 5 }, (_, i) => tokyoNow.getHours() + i);

    return (
      <div className="relative">
        {hours.map((hour) => (
          <div key={hour} className="flex items-center h-16 border-t">
            <span className="w-16 text-xs text-gray-500">{hour.toString().padStart(2, '0')}:00</span>
            <div className="flex-grow relative">
              {todayEvents
                .filter(event => {
                  const eventStart = new Date(event.start.dateTime || event.start.date);
                  return eventStart.getHours() === hour;
                })
                .map(event => {
                  const startTime = new Date(event.start.dateTime || event.start.date);
                  const endTime = new Date(event.end.dateTime || event.end.date);
                  const duration = differenceInMinutes(endTime, startTime);
                  const topPosition = ((startTime.getMinutes() / 60) * 100) + '%';
                  const height = ((duration / 60) * 100) + '%';

                  return (
                    <div 
                      key={event.id} 
                      className="absolute left-0 right-0 border rounded overflow-hidden"
                      style={{
                        top: topPosition,
                        height: height,
                        borderLeftColor: event.colorId ? \`#\${event.colorId}\` : '#4285F4',
                        borderLeftWidth: '4px'
                      }}
                    >
                      <div className="p-1 text-xs flex justify-between">
                        <span>{format(startTime, 'HH:mm')}</span>
                        <span>{(duration / 60).toFixed(1)}h</span>
                      </div>
                      <div className="p-1 text-xs">{event.summary}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
        <div 
          className="absolute left-0 right-0 border-t border-red-500 z-10" 
          style={{ top: \`\${((tokyoNow.getHours() % 1) * 60 + tokyoNow.getMinutes()) / 60 * 100}%\` }}
        >
          <span className="absolute -top-3 -left-16 text-xs text-red-500">
            {format(tokyoNow, 'HH:mm')}
          </span>
        </div>
      </div>
    );
  };

  const renderUpcomingEvents = () => {
    return events.slice(0, 10).map(event => (
      <div key={event.id} className="mb-2">
        <span className="font-semibold">{event.summary}</span> - {event.formattedStart} {event.formattedTimeRange}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">研究管理ダッシュボード</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>タスク管理</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="新しいタスクを入力"
              />
              <Button onClick={handleAddTask}><Plus className="h-4 w-4 mr-2" /> 追加</Button>
            </div>
            <h3 className="text-lg font-semibold mb-2">今日のタスク</h3>
            {renderTaskList(todayTasks)}
            <h3 className="text-lg font-semibold mt-4 mb-2">今週のタスク</h3>
            {renderTaskList(thisWeekTasks)}
          </CardContent>
        </Card>

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
                {calendarError ? (
                  <p className="text-red-500">{calendarError}</p>
                ) : (
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                      <TabsTrigger value="today">今日の予定</TabsTrigger>
                      <TabsTrigger value="upcoming">直近の予定</TabsTrigger>
                    </TabsList>
                    <TabsContent value="today">{renderTodayEvents()}</TabsContent>
                    <TabsContent value="upcoming">{renderUpcomingEvents()}</TabsContent>
                  </Tabs>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>プロジェクト進捗</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.length > 0 ? (
                projects.map(project => (
                  <div key={project.id}>
                    <div className="flex justify-between mb-1">
                      <span>{project.name}</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                ))
              ) : (
                <p>プロジェクトがありません</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>出版物推移</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={publicationData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
`;

  try {
    await fs.writeFile(filePath, content, 'utf8');
    console.log('Dashboard.jsx has been successfully updated!');
  } catch (error) {
    console.error('Error updating Dashboard.jsx:', error);
  }
}

updateDashboardJsx();