import React, { useState } from "react";
import {
  Activity,
  Users,
  DollarSign,
  TrendingUp,
  Filter,
  RotateCcw,
  Download,
  Calendar,
  MapPin,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

// Mock data for the dashboard
const statsData = {
  totalKegiatan: 1247,
  totalMitra: 834,
  totalHonor: 2850000000,
  kegiatanTrend: 12.5,
  mitraTrend: 8.2,
  honorTrend: 15.3,
};

const monthlyHonorData = [
  { name: "Jan", honor: 180000000 },
  { name: "Feb", honor: 220000000 },
  { name: "Mar", honor: 190000000 },
  { name: "Apr", honor: 250000000 },
  { name: "Mei", honor: 280000000 },
  { name: "Jun", honor: 310000000 },
  { name: "Jul", honor: 290000000 },
  { name: "Agu", honor: 340000000 },
  { name: "Sep", honor: 320000000 },
  { name: "Okt", honor: 360000000 },
];

const topMitraData = [
  { name: "Ahmad Subaki", honor: 15000000, kegiatan: 8 },
  { name: "Siti Rahmawati", honor: 12500000, kegiatan: 6 },
  { name: "Muhammad Iqbal", honor: 11200000, kegiatan: 7 },
  { name: "Dewi Sartika", honor: 10800000, kegiatan: 5 },
  { name: "Bayu Setiawan", honor: 9500000, kegiatan: 4 },
  { name: "Rina Marlina", honor: 8900000, kegiatan: 6 },
  { name: "Andi Pratama", honor: 8200000, kegiatan: 3 },
  { name: "Lina Handayani", honor: 7800000, kegiatan: 4 },
  { name: "Ridwan Kamil", honor: 7300000, kegiatan: 5 },
  { name: "Maya Sari", honor: 6900000, kegiatan: 3 },
];

const teamDistributionData = [
  { name: "Tim Sosial", value: 35, color: "#3b82f6" },
  { name: "Tim Ekonomi", value: 30, color: "#10b981" },
  { name: "Tim Produksi", value: 20, color: "#f59e0b" },
  { name: "Tim Distribusi", value: 15, color: "#ef4444" },
];

const honorByCategoryData = [
  { name: "Survei Rumah Tangga", honor: 890000000 },
  { name: "Sensus Ekonomi", honor: 650000000 },
  { name: "Survei Perusahaan", honor: 520000000 },
  { name: "Pendataan Harga", honor: 380000000 },
  { name: "Survei Pertanian", honor: 290000000 },
  { name: "Lainnya", honor: 120000000 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("id-ID").format(value);
};

export default function Index() {
  const [filterPeriod, setFilterPeriod] = useState("2024");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterTeam, setFilterTeam] = useState("all");

  const resetFilters = () => {
    setFilterPeriod("2024");
    setFilterRegion("all");
    setFilterTeam("all");
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Jumlah Kegiatan
              </p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">
                {formatNumber(statsData.totalKegiatan)}
              </p>
            </div>
            <div className="h-10 w-10 lg:h-12 lg:w-12 bg-brand-100 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 lg:h-6 lg:w-6 text-brand-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jumlah Mitra</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(statsData.totalMitra)}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Honor</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(statsData.totalHonor)}
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
