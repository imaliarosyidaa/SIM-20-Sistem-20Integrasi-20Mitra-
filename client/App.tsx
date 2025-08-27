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
import MatriksKegiatanCalendar from "./pages/MatriksKegiatanCalendar";
import RekapHonor from "./pages/RekapHonor";
import HonorBulanan from "./pages/HonorBulanan";
import DatabaseMitra from "./pages/DatabaseMitra";
import EvaluasiMitra from "./pages/EvaluasiMitra";
import NotFound from "./pages/NotFound";
import UploadTemplate from "./pages/UploadTemplate";
import AddKegiatan from "./pages/AddKegiatan";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/rekap-honor" element={<RekapHonor />} />
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route
                    path="/matriks"
                    element={<MatriksKegiatanOverview />}
                  />
                  <Route
                    path="/matriks/calendar"
                    element={<MatriksKegiatanCalendar />}
                  />
                  <Route
                    path="/matriks/calendar/:month"
                    element={<MatriksKegiatanCalendar />}
                  />
                  <Route path="/honor-bulanan" element={<HonorBulanan />} />
                  <Route path="/database" element={<DatabaseMitra />} />
                  <Route path="/evaluasi" element={<EvaluasiMitra />} />
                  <Route path="/add-kegiatan" element={<AddKegiatan />} />
                  <Route path="/upload-template" element={<UploadTemplate />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
