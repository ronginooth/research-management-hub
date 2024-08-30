import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

const publicationData = [
  { month: 'Jan', count: 2 },
  { month: 'Feb', count: 1 },
  { month: 'Mar', count: 3 },
  { month: 'Apr', count: 0 },
  { month: 'May', count: 2 },
  { month: 'Jun', count: 1 },
];

export default function Dashboard({ tasks, addTask }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTaskName, setNewTaskName] = useState('');

  const handleAddTask = () => {
    if (newTaskName.trim() !== '') {
      addTask({
        name: newTaskName,
        dueDate: selectedDate.toISOString().split('T')[0],
        status: "未完了"
      });
      setNewTaskName('');
    }
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
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">タスク追加</h3>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="新しいタスク"
                  className="flex-1"
                />
                <Button onClick={handleAddTask}>追加</Button>
              </div>
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
