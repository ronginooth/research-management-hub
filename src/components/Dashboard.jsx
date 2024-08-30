import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from "@/components/ui/calendar";

const publicationData = [
  { month: 'Jan', count: 2 },
  { month: 'Feb', count: 1 },
  { month: 'Mar', count: 3 },
  { month: 'Apr', count: 0 },
  { month: 'May', count: 2 },
  { month: 'Jun', count: 1 },
];

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Here you would typically fetch tasks from an API or global state
    // For now, we'll use mock data
    const mockTasks = [
      { id: 1, name: "実験計画会議", dueDate: "2024-03-15", status: "未完了" },
      { id: 2, name: "データ解析ワークショップ", dueDate: "2024-03-22", status: "未完了" },
      { id: 3, name: "論文提出締切", dueDate: "2024-04-05", status: "未完了" },
    ];
    setTasks(mockTasks);
  }, []);

  const addTask = (name) => {
    const newTask = {
      id: Date.now(),
      name: name,
      dueDate: selectedDate.toISOString().split('T')[0],
      status: "未完了"
    };
    setTasks([...tasks, newTask]);
  };

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
              <div>
                <div className="flex justify-between mb-1">
                  <span>遺伝子発現解析</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>タンパク質構造解析</span>
                  <span>40%</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>細胞培養実験</span>
                  <span>90%</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
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
            <Button variant="link" onClick={() => console.log("カレンダーを開く")}>
              カレンダー <ChevronRight className="inline h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            <div>
              <h3 className="text-lg font-semibold mb-2">タスク追加</h3>
              <input
                type="text"
                placeholder="新しいタスク"
                className="border rounded p-2 mb-2 w-full"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addTask(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <p className="text-sm text-gray-500">Enterキーを押してタスクを追加</p>
            </div>
          </div>
          <ul className="space-y-2">
            {tasks.map(task => (
              <li key={task.id} className="flex items-center">
                <CalendarIcon className="mr-2 text-blue-500" size={16} />
                <span>{task.name} ({task.dueDate})</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
