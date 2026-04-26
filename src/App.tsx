import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Avaliacao from "./pages/Avaliacao";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Students from "./pages/Students";
import StudentDetails from "./pages/StudentDetails";
import EvaluationReport from "./pages/EvaluationReport";
import SharedWorkouts from "./pages/SharedWorkouts";
import SharedDiets from "./pages/SharedDiets";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Students />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentDetails />} />
          <Route path="/avaliacao" element={<Avaliacao />} />
          <Route path="/avaliacao/:studentId" element={<Avaliacao />} />
          <Route path="/avaliacao/:studentId/:evaluationId" element={<Avaliacao />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:studentId" element={<Dashboard />} />
          <Route path="/report/:id" element={<EvaluationReport />} />
          <Route path="/share/workouts/:studentId" element={<SharedWorkouts />} />
          <Route path="/share/diets/:studentId" element={<SharedDiets />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
