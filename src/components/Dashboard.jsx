import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { getTasks } from '../utils/taskDatabase';

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

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const todayTasks = tasks.filter(task => task.timeframe === '今日');
  const thisWeekTasks = tasks.filter(task => task.timeframe === '今週');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">研究管理ダッシュボード</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            今後の予定
            <Link to="/tasks">
              <Button variant="link">
                タスク管理 <ChevronRight className="inline h-4 w-4" />
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">今日のタスク</h3>
          <ul className="space-y-2 mb-4">
            {todayTasks.length > 0 ? (
              todayTasks.map(task => (
                <li key={task.id} className="flex items-center">
                  <CalendarIcon className="mr-2 text-blue-500" size={16} />
                  <Link to={`/task/${task.id}`}>{task.name}</Link>
                </li>
              ))
            ) : (
              <li>今日のタスクはありません</li>
            )}
          </ul>
          <h3 className="text-lg font-semibold mb-2">今週のタスク</h3>
          <ul className="space-y-2">
            {thisWeekTasks.length > 0 ? (
              thisWeekTasks.map(task => (
                <li key={task.id} className="flex items-center">
                  <CalendarIcon className="mr-2 text-green-500" size={16} />
                  <Link to={`/task/${task.id}`}>{task.name}</Link>
                </li>
              ))
            ) : (
              <li>今週のタスクはありません</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
