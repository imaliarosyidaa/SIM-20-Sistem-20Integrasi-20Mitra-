import "./global.css";
import 'regenerator-runtime';
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import MatriksKegiatanOverview from "./pages/MatriksKegiatanOverview";
import RekapHonor from "./pages/RekapHonor";
import HonorBulanan from "./pages/HonorBulanan";
import DatabaseMitra from "./pages/DatabaseMitra";
import EvaluasiMitra from "./pages/EvaluasiMitra";
import NotFound from "./pages/NotFound";
import UploadTemplate from "./pages/UploadTemplate";
import AddKegiatan from "./pages/AddKegiatan";
import { AuthProvider } from "./context/AuthProvider";
import PersistLogin from "./components/PersistLogin";
import Dashboard from "./pages/Dashboard";
import Keuangan from "./pages/Keuangan";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />

            <Route element={<PersistLogin />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route element={<Layout />}>
                <Route path="/rekap-honor" element={<RekapHonor />} />
              </Route>
              <Route element={<Layout />}>
                <Route path="/matriks" element={<MatriksKegiatanOverview />} />
              </Route>
              <Route element={<Layout />}>
                <Route path="/honor-bulanan" element={<HonorBulanan />} />
              </Route>
              <Route element={<Layout />}>
                <Route path="/database" element={<DatabaseMitra />} />
              </Route>
              <Route element={<Layout />}>
                <Route path="/evaluasi" element={<EvaluasiMitra />} />
              </Route>
              <Route element={<Layout />}>
                <Route path="/add-kegiatan" element={<AddKegiatan />} />
              </Route>
              <Route element={<Layout />}>
                <Route path="/upload-template" element={<UploadTemplate />} />
              </Route>
              <Route element={<Layout />}>
                <Route path="/keuangan" element={<Keuangan />} />
              </Route>
            </Route>
            {/* Catch-all route for 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);