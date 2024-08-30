import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./components/Dashboard";
import TaskManager from "./components/TaskManager";
import ExperimentNotes from "./components/ExperimentNotes";
import DataAnalysis from "./components/DataAnalysis";
import Layout from "./components/Layout";
import ExperimentPlanner from "./components/ExperimentPlanner";
import LiteratureManager from "./components/LiteratureManager";
import InventoryManager from "./components/InventoryManager";

const queryClient = new QueryClient();

const App = () => {
  const [tasks, setTasks] = useState([]);

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
              <Route index element={<Dashboard tasks={tasks} addTask={addTask} />} />
              <Route path="tasks" element={<TaskManager tasks={tasks} addTask={addTask} updateTask={updateTask} />} />
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
