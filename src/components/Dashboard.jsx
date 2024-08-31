import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CalendarIcon, ChevronRight, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { getTasks, updateTask, addTask } from '../utils/taskDatabase';
import { format } from 'date-fns';

const publicationData = [
  { month: 'Jan', count: 2 },
  { month: 'Feb', count: 1 },
  { month: 'Mar', count: 3 },
  { month: 'Apr', count: 0 },
  { month: 'May', count: 2 },
  { month: 'Jun', count: 1 },
];

// Mock Google Calendar events
const calendarEvents = [
  { id: 1, title: 'ミーティング', start: '09:00', end: '10:00' },
  { id: 2, title: '実験', start: '11:00', end: '13:00' },
  { id: 3, title: '論文執筆', start: '14:00', end: '16:00' },
  { id: 4, title: 'セミナー', start: '16:30', end: '18:00' },
];

export default function Dashboard({ projects = [] }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const todayTasks = tasks.filter(task => task.timeframe === '今日');
  const thisWeekTasks = tasks.filter(task => task.timeframe === '今週');

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
              <Link to={`/task/${task.id}`} className={`block ${task.status === '完了' ? 'line-through text-gray-500' : ''}`}>
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

  const renderCalendar = () => {
    const now = new Date();
    const currentHour = now.getHours();

    return (
      <div className="relative h-96 overflow-y-auto">
        {['朝', '日中', '夜'].map((timeOfDay, index) => (
          <div key={timeOfDay} className="mb-4">
            <h4 className="text-sm font-semibold mb-2">{timeOfDay}</h4>
            <div className="space-y-2">
              {calendarEvents.filter(event => {
                const eventHour = parseInt(event.start.split(':')[0]);
                return (index === 0 && eventHour < 10) ||
                       (index === 1 && eventHour >= 10 && eventHour < 18) ||
                       (index === 2 && eventHour >= 18);
              }).map(event => (
                <div key={event.id} className="bg-blue-100 p-2 rounded">
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-gray-600">{event.start} - {event.end}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div
          className="absolute left-0 right-0 border-t-2 border-red-500"
          style={{ top: `${(currentHour / 24) * 100}%` }}
        ></div>
      </div>
    );
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
            {renderCalendar()}
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
