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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Statistik</h1>
            <p className="text-brand-100 mt-1">
              Sistem Informasi Manajemen - BPS Lombok Tengah
            </p>
            <div className="flex items-center mt-3 space-x-4 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Periode: Oktober 2024</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Wilayah: Lombok Tengah</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {formatNumber(statsData.totalKegiatan + statsData.totalMitra)}
            </div>
            <div className="text-brand-100">Total Entitas</div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
            </div>

            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="2024">Tahun 2024</option>
              <option value="2023">Tahun 2023</option>
              <option value="2022">Tahun 2022</option>
            </select>

            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">Semua Desa</option>
              <option value="utara">Lombok Tengah Utara</option>
              <option value="selatan">Lombok Tengah Selatan</option>
              <option value="timur">Lombok Tengah Timur</option>
              <option value="barat">Lombok Tengah Barat</option>
            </select>

            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">Semua Tim</option>
              <option value="sosial">Tim Sosial</option>
              <option value="ekonomi">Tim Ekonomi</option>
              <option value="produksi">Tim Produksi</option>
              <option value="distribusi">Tim Distribusi</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset Filter
            </button>
            <button className="flex items-center px-4 py-2 text-sm text-white bg-brand-600 rounded-md hover:bg-brand-700 transition-colors">
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Jumlah Kegiatan
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(statsData.totalKegiatan)}
              </p>
            </div>
            <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-brand-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">
              +{statsData.kegiatanTrend}%
            </span>
            <span className="text-sm text-gray-500 ml-2">dari bulan lalu</span>
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
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">
              +{statsData.mitraTrend}%
            </span>
            <span className="text-sm text-gray-500 ml-2">dari bulan lalu</span>
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
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">
              +{statsData.honorTrend}%
            </span>
            <span className="text-sm text-gray-500 ml-2">dari bulan lalu</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Honor Trend */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tren Honor Bulanan
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyHonorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) =>
                  formatCurrency(value).slice(0, -3) + "M"
                }
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Honor"]}
                labelStyle={{ color: "#374151" }}
              />
              <Area
                type="monotone"
                dataKey="honor"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Team Distribution */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribusi Kegiatan Per Tim
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={teamDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {teamDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Persentase"]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {teamDistributionData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-medium text-gray-900 ml-auto">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Mitra */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            10 Teratas Honor Mitra Per Bulan
          </h3>
          <div className="space-y-3">
            {topMitraData.map((mitra, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{mitra.name}</p>
                    <p className="text-sm text-gray-500">
                      {mitra.kegiatan} kegiatan
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(mitra.honor)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Honor by Category */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Honor Per Kategori
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={honorByCategoryData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                type="number"
                stroke="#64748b"
                fontSize={10}
                tickFormatter={(value) =>
                  formatCurrency(value).slice(0, -6) + "M"
                }
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#64748b"
                fontSize={10}
                width={80}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Honor"]}
              />
              <Bar dataKey="honor" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
