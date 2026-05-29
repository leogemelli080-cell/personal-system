import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Avaliacao from "./pages/Avaliacao";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Students from "./pages/Students";
import StudentDetails from "./pages/StudentDetails";
import EvaluationReport from "./pages/EvaluationReport";
import SharedWorkouts from "./pages/SharedWorkouts";
import SharedDiets from "./pages/SharedDiets";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/share/workouts/:studentId" element={<SharedWorkouts />} />
            <Route path="/share/diets/:studentId" element={<SharedDiets />} />
            <Route path="/" element={<ProtectedRoute><Students /></ProtectedRoute>} />
            <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
            <Route path="/students/:id" element={<ProtectedRoute><StudentDetails /></ProtectedRoute>} />
            <Route path="/avaliacao" element={<ProtectedRoute><Avaliacao /></ProtectedRoute>} />
            <Route path="/avaliacao/:studentId" element={<ProtectedRoute><Avaliacao /></ProtectedRoute>} />
            <Route path="/avaliacao/:studentId/:evaluationId" element={<ProtectedRoute><Avaliacao /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/:studentId" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/report/:id" element={<EvaluationReport />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
