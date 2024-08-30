import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'プロジェクトA', 完了タスク: 4, 未完了タスク: 2 },
  { name: 'プロジェクトB', 完了タスク: 3, 未完了タスク: 1 },
  { name: 'プロジェクトC', 完了タスク: 2, 未完了タスク: 3 },
];

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">ダッシュボード</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>プロジェクト概要</CardTitle>
          </CardHeader>
          <CardContent>
            <p>アクティブプロジェクト: 3</p>
            <p>完了タスク: 9</p>
            <p>未完了タスク: 6</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>タスク状況</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart width={300} height={200} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="完了タスク" fill="#8884d8" />
              <Bar dataKey="未完了タスク" fill="#82ca9d" />
            </BarChart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;