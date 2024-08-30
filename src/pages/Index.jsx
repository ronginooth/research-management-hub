import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from '../components/Dashboard';
import TaskManager from '../components/TaskManager';
import ExperimentNotes from '../components/ExperimentNotes';
import DataAnalysis from '../components/DataAnalysis';
import ExperimentPlanner from '../components/ExperimentPlanner';
import LiteratureManager from '../components/LiteratureManager';
import InventoryManager from '../components/InventoryManager';

const Index = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">研究管理システム</h1>
      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">ダッシュボード</TabsTrigger>
          <TabsTrigger value="planner">実験計画</TabsTrigger>
          <TabsTrigger value="literature">文献管理</TabsTrigger>
          <TabsTrigger value="tasks">タスク管理</TabsTrigger>
          <TabsTrigger value="inventory">物品管理</TabsTrigger>
          <TabsTrigger value="experiments">実験ノート</TabsTrigger>
          <TabsTrigger value="analysis">データ分析</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <Dashboard />
        </TabsContent>
        <TabsContent value="planner">
          <ExperimentPlanner />
        </TabsContent>
        <TabsContent value="literature">
          <LiteratureManager />
        </TabsContent>
        <TabsContent value="tasks">
          <TaskManager />
        </TabsContent>
        <TabsContent value="inventory">
          <InventoryManager />
        </TabsContent>
        <TabsContent value="experiments">
          <ExperimentNotes />
        </TabsContent>
        <TabsContent value="analysis">
          <DataAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
