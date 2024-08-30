import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const publicationData = [
  { month: 'Jan', count: 2 },
  { month: 'Feb', count: 1 },
  { month: 'Mar', count: 3 },
  { month: 'Apr', count: 0 },
  { month: 'May', count: 2 },
  { month: 'Jun', count: 1 },
];

export default function Dashboard() {
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
            <Button variant="link">
              カレンダー <ChevronRight className="inline h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Calendar className="mr-2 text-red-500" size={16} />
              <span>実験計画会議 (明日)</span>
            </li>
            <li className="flex items-center">
              <Calendar className="mr-2 text-green-500" size={16} />
              <span>データ解析ワークショップ (来週)</span>
            </li>
            <li className="flex items-center">
              <Calendar className="mr-2 text-yellow-500" size={16} />
              <span>論文提出締切 (3週間後)</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
