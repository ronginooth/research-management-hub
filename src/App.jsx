import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./components/Dashboard";
import TaskManager from "./components/TaskManager";
import TaskDetail from "./components/TaskDetail";
import ExperimentNotes from "./components/ExperimentNotes";
import DataAnalysis from "./components/DataAnalysis";
import Layout from "./components/Layout";
import ExperimentPlanner from "./components/ExperimentPlanner";
import LiteratureManager from "./components/LiteratureManager";
import InventoryManager from "./components/InventoryManager";

const queryClient = new QueryClient();

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([
    { id: 1, name: '遺伝子発現解析', progress: 75 },
    { id: 2, name: 'タンパク質構造解析', progress: 40 },
    { id: 3, name: '細胞培養実験', progress: 90 },
  ]);

  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard tasks={tasks} projects={projects} />} />
              <Route path="tasks" element={<TaskManager tasks={tasks} addTask={addTask} updateTask={updateTask} projects={projects} />} />
              <Route path="task/:id" element={<TaskDetail tasks={tasks} updateTask={updateTask} projects={projects} />} />
              <Route path="experiments" element={<ExperimentNotes />} />
              <Route path="analysis" element={<DataAnalysis />} />
              <Route path="planner" element={<ExperimentPlanner />} />
              <Route path="literature" element={<LiteratureManager />} />
              <Route path="inventory" element={<InventoryManager />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
