import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  BarChart3,
  PieChart,
  Filter,
  Download,
  ChevronRight,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

// Mock data untuk dashboard
const monthlyData = [
  { month: 'Jan', kegiatan: 85, mitra: 42, selesai: 78, pending: 7 },
  { month: 'Feb', kegiatan: 92, mitra: 48, selesai: 89, pending: 3 },
  { month: 'Mar', kegiatan: 78, mitra: 39, selesai: 75, pending: 3 },
  { month: 'Apr', kegiatan: 105, mitra: 52, selesai: 98, pending: 7 },
  { month: 'Mei', kegiatan: 118, mitra: 58, selesai: 112, pending: 6 },
  { month: 'Jun', kegiatan: 134, mitra: 67, selesai: 127, pending: 7 },
  { month: 'Jul', kegiatan: 142, mitra: 71, selesai: 128, pending: 14 },
  { month: 'Agu', kegiatan: 125, mitra: 63, selesai: 118, pending: 7 },
  { month: 'Sep', kegiatan: 138, mitra: 69, selesai: 132, pending: 6 },
  { month: 'Okt', kegiatan: 156, mitra: 78, selesai: 145, pending: 11 },
  { month: 'Nov', kegiatan: 0, mitra: 0, selesai: 0, pending: 0 },
  { month: 'Des', kegiatan: 0, mitra: 0, selesai: 0, pending: 0 }
];

const categoryData = [
  { name: 'Sensus Penduduk', value: 35, color: '#3b82f6' },
  { name: 'Survei Ekonomi', value: 28, color: '#10b981' },
  { name: 'Pendataan Harga', value: 20, color: '#f59e0b' },
  { name: 'Survei Pertanian', value: 17, color: '#ef4444' }
];

const regionData = [
  { region: 'Praya', kegiatan: 45, selesai: 42 },
  { region: 'Praya Timur', kegiatan: 38, selesai: 35 },
  { region: 'Praya Barat', kegiatan: 41, selesai: 39 },
  { region: 'Pujut', kegiatan: 33, selesai: 31 },
  { region: 'Jonggat', kegiatan: 29, selesai: 27 }
];

const mitraPerformance = [
  { name: 'Ahmad Subaki', kegiatan: 12, rating: 4.8 },
  { name: 'Siti Rahmawati', kegiatan: 10, rating: 4.7 },
  { name: 'Muhammad Iqbal', kegiatan: 11, rating: 4.9 },
  { name: 'Dewi Sartika', kegiatan: 9, rating: 4.6 },
  { name: 'Bayu Setiawan', kegiatan: 8, rating: 4.5 }
];

export default function MatriksKegiatanOverview() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const currentMonth = new Date().getMonth();
  const totalKegiatan = monthlyData.slice(0, currentMonth + 1).reduce((sum, item) => sum + item.kegiatan, 0);
  const totalMitra = monthlyData.slice(0, currentMonth + 1).reduce((sum, item) => Math.max(sum, item.mitra), 0);
  const totalSelesai = monthlyData.slice(0, currentMonth + 1).reduce((sum, item) => sum + item.selesai, 0);
  const completionRate = totalKegiatan > 0 ? ((totalSelesai / totalKegiatan) * 100).toFixed(1) : 0;

  const handleMonthClick = (month: string) => {
    navigate(`/matriks/calendar/${month.toLowerCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Matriks Kegiatan</h1>
            <p className="text-brand-100 mt-1">Dashboard Monitoring & Evaluasi Kegiatan Mitra</p>
            <div className="flex items-center mt-3 space-x-4 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Periode: Tahun {selectedYear}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Kabupaten Lombok Tengah</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{completionRate}%</div>
            <div className="text-brand-100">Tingkat Penyelesaian</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
            </div>
            
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="2024">Tahun 2024</option>
              <option value="2023">Tahun 2023</option>
              <option value="2022">Tahun 2022</option>
            </select>

            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">Semua Kecamatan</option>
              <option value="praya">Praya</option>
              <option value="praya-timur">Praya Timur</option>
              <option value="praya-barat">Praya Barat</option>
              <option value="pujut">Pujut</option>
              <option value="jonggat">Jonggat</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center px-4 py-2 text-sm text-white bg-brand-600 rounded-md hover:bg-brand-700 transition-colors">
              <Download className="h-4 w-4 mr-1" />
              Export Laporan
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Kegiatan</p>
              <p className="text-2xl font-bold text-gray-900">{totalKegiatan}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+12.5%</span>
            <span className="text-sm text-gray-500 ml-2">dari tahun lalu</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kegiatan Selesai</p>
              <p className="text-2xl font-bold text-gray-900">{totalSelesai}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+8.3%</span>
            <span className="text-sm text-gray-500 ml-2">efisiensi meningkat</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mitra Aktif</p>
              <p className="text-2xl font-bold text-gray-900">{totalMitra}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+15.2%</span>
            <span className="text-sm text-gray-500 ml-2">partisipasi naik</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rata-rata Durasi</p>
              <p className="text-2xl font-bold text-gray-900">4.2</p>
              <p className="text-xs text-gray-500">jam/kegiatan</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-green-600 font-medium">-5.8%</span>
            <span className="text-sm text-gray-500 ml-2">lebih efisien</span>
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Tren Kegiatan Bulanan</h3>
          <p className="text-sm text-gray-500">Klik bulan untuk melihat detail kalender</p>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              stroke="#64748b" 
              fontSize={12}
              onClick={(data) => data && handleMonthClick(data.value)}
              style={{ cursor: 'pointer' }}
            />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              formatter={(value: number, name: string) => [value, name === 'kegiatan' ? 'Total Kegiatan' : name === 'selesai' ? 'Selesai' : 'Pending']}
              labelStyle={{ color: '#374151' }}
            />
            <Area 
              type="monotone" 
              dataKey="kegiatan" 
              stackId="1"
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.6}
              onClick={(data) => data && handleMonthClick(data.payload.month)}
              style={{ cursor: 'pointer' }}
            />
            <Area 
              type="monotone" 
              dataKey="selesai" 
              stackId="2"
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.6}
              onClick={(data) => data && handleMonthClick(data.payload.month)}
              style={{ cursor: 'pointer' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Kategori Kegiatan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}%`, 'Persentase']} />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600 truncate">{item.name}</span>
                <span className="text-sm font-medium text-gray-900 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Performance */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performa Per Kecamatan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis type="category" dataKey="region" stroke="#64748b" fontSize={12} width={80} />
              <Tooltip />
              <Bar dataKey="kegiatan" fill="#3b82f6" name="Total" radius={[0, 4, 4, 0]} />
              <Bar dataKey="selesai" fill="#10b981" name="Selesai" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top Mitra Performer</h3>
          <button 
            onClick={() => navigate('/database')}
            className="flex items-center text-sm text-brand-600 hover:text-brand-700"
          >
            Lihat Semua
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {mitraPerformance.map((mitra, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                {mitra.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h4 className="font-medium text-gray-900 text-sm">{mitra.name}</h4>
              <p className="text-xs text-gray-500 mb-1">{mitra.kegiatan} kegiatan</p>
              <div className="flex items-center justify-center">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-3 h-3 rounded-full ${i < Math.floor(mitra.rating) ? 'bg-yellow-400' : 'bg-gray-200'}`}
                  />
                ))}
                <span className="text-xs text-gray-600 ml-1">{mitra.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
