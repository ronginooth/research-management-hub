import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import TaskManager from "./components/TaskManager";
import ExperimentNotes from "./components/ExperimentNotes";
import DataAnalysis from "./components/DataAnalysis";
import Layout from "./components/Layout";
import ExperimentPlanner from "./components/ExperimentPlanner";
import LiteratureManager from "./components/LiteratureManager";
import InventoryManager from "./components/InventoryManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<TaskManager />} />
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

export default App;
