import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Calendar, FileText, Beaker, BookOpen, Users, Brain, Bell, ChevronRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const publicationData = [
  { month: 'Jan', count: 2 },
  { month: 'Feb', count: 1 },
  { month: 'Mar', count: 3 },
  { month: 'Apr', count: 0 },
  { month: 'May', count: 2 },
  { month: 'Jun', count: 1 },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const handleQuickAccess = (route) => {
    console.log(`Navigating to ${route}`)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">研究管理ダッシュボード</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <QuickAccessCard 
          icon={<Beaker className="text-blue-500" />} 
          title="実験ノート" 
          description="最終更新: 2時間前" 
          onClick={() => handleQuickAccess('/experiments')}
        />
        <QuickAccessCard 
          icon={<FileText className="text-green-500" />} 
          title="論文ドラフト" 
          description="進捗率: 60%" 
          onClick={() => handleQuickAccess('/drafts')}
        />
        <QuickAccessCard 
          icon={<Users className="text-purple-500" />} 
          title="チーム連携" 
          description="3件の新しいメッセージ" 
          onClick={() => handleQuickAccess('/team')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              プロジェクト進捗
              <Button variant="link" onClick={() => handleQuickAccess('/projects')}>
                詳細 <ChevronRight className="inline h-4 w-4" />
              </Button>
            </CardTitle>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              今後の予定
              <Button variant="link" onClick={() => handleQuickAccess('/calendar')}>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              チームアクティビティ
              <Button variant="link" onClick={() => handleQuickAccess('/team')}>
                詳細 <ChevronRight className="inline h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src="/api/placeholder/32/32" alt="@member1" />
                  <AvatarFallback>M1</AvatarFallback>
                </Avatar>
                <span>田中さんが新しい実験結果を共有しました</span>
              </li>
              <li className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src="/api/placeholder/32/32" alt="@member2" />
                  <AvatarFallback>M2</AvatarFallback>
                </Avatar>
                <span>佐藤さんがデータ解析を完了しました</span>
              </li>
              <li className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src="/api/placeholder/32/32" alt="@member3" />
                  <AvatarFallback>M3</AvatarFallback>
                </Avatar>
                <span>鈴木さんが新しい文献を追加しました</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              AI研究アシスタント
              <Brain className="text-purple-500" size={20} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">最新の推奨事項:</p>
            <ul className="space-y-2 text-sm">
              <li>• 最新のゲノム編集技術に関する論文を確認することをお勧めします</li>
              <li>• 現在の実験データに基づいて、次の実験計画の最適化を提案できます</li>
              <li>• 類似の研究プロジェクトとの潜在的なコラボレーション機会が見つかりました</li>
            </ul>
            <Button className="w-full mt-4" onClick={() => handleQuickAccess('/ai-assistant')}>
              AI アシスタントと対話
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>詳細情報</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">概要</TabsTrigger>
              <TabsTrigger value="experiments">実験</TabsTrigger>
              <TabsTrigger value="publications">出版物</TabsTrigger>
              <TabsTrigger value="resources">リソース</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p>現在進行中のプロジェクト: 3件</p>
              <p>完了したマイルストーン: 7件</p>
              <p>次回のチームミーティング: 5月15日</p>
              <Button className="mt-4" onClick={() => handleQuickAccess('/overview')}>詳細を見る</Button>
            </TabsContent>
            <TabsContent value="experiments">
              <p>進行中の実験: 2件</p>
              <p>データ解析待ち: 3データセット</p>
              <p>使用中の機器: 電子顕微鏡、フローサイトメーター</p>
              <Button className="mt-4" onClick={() => handleQuickAccess('/experiments')}>実験詳細へ</Button>
            </TabsContent>
            <TabsContent value="publications">
              <p>執筆中の論文: 2件</p>
              <p>査読中の論文: 1件</p>
              <p>今年の出版数: 3件</p>
              <Button className="mt-4" onClick={() => handleQuickAccess('/publications')}>出版物リストへ</Button>
            </TabsContent>
            <TabsContent value="resources">
              <p>利用可能な計算リソース: 4 GPUノード</p>
              <p>共有ストレージ容量: 500TB / 1PB</p>
              <p>次回のメンテナンス予定: 6月1日</p>
              <Button className="mt-4" onClick={() => handleQuickAccess('/resources')}>リソース管理へ</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function QuickAccessCard({ icon, title, description, onClick }) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
        <Button className="mt-2 w-full">開く</Button>
      </CardContent>
    </Card>
  )
}
