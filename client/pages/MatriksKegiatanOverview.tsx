import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Filter,
  RotateCcw,
  ChevronRight,
  Calendar,
  Clock,
  Users
} from 'lucide-react';

const monthlyActivities = {
  'Januari': [
    'SPKK',
    'SPH',
    'Pendataan RPH',
    'Pendataan IBS Bulanan',
    'Pemutakhiran SAKEENAS Februari 2024',
    'Pemutakhiran SAKEENAS Februari',
    'Dan lainnya...'
  ],
  'Februari': [
    'Pemutakhiran SUSENAS-SERUTI',
    'Pemutakhiran SUSENAS Maret 2024',
    'Pemutakhiran SUSENAS Maret',
    'PES',
    'SPA Padi',
    'VN-Orang',
    'Dan lainnya...'
  ],
  'Maret': [
    'Pendataan Survei Upahan Subround I',
    'Pendataan SUSENAS Maret 2024',
    'Pendataan RPH',
    'Pendataan IBS Bulanan',
    'PES',
    'Listing HMK Tiwulanaan',
    'Dan lainnya...'
  ],
  'April': [
    'VHTS',
    'Updating Survei Upahan Pekerja Sub 2',
    'Updating Direktori Konstruksi',
    'Updating Direktori Perusahaan Konstruksi',
    'Dan lainnya...'
  ],
  'Mei': [
    'VNGST LMK',
    'VN Hotel',
    'VHTS',
    'VHT',
    'Dan lainnya...'
  ],
  'Juni': [
    'LIFSIP',
    'Survei Upahan Subround 2',
    'STRPN',
    'SKTH',
    'Dan lainnya...'
  ],
  'Juli': [
    'Sensus Penduduk',
    'Survei Ekonomi',
    'Pendataan Harga',
    'SPKK',
    'Dan lainnya...'
  ],
  'Agustus': [
    'VHTS',
    'Updating Survei Upahan',
    'Pendataan RPH',
    'Dan lainnya...'
  ],
  'September': [
    'Survei Upahan Subround 3',
    'Pendataan SUSENAS',
    'STRPN',
    'Dan lainnya...'
  ],
  'Oktober': [
    'LIFSIP',
    'Updating Direktori',
    'VNGST LMK',
    'Dan lainnya...'
  ],
  'November': [
    'Pendataan RPH',
    'SPKK',
    'VN Hotel',
    'Dan lainnya...'
  ],
  'Desember': [
    'Updating Survei Upahan',
    'Pendataan IBS Bulanan',
    'VHTS',
    'Dan lainnya...'
  ]
};

const monthProgress = {
  'Januari': { completed: 7, total: 17 },
  'Februari': { completed: 26, total: 26 },
  'Maret': { completed: 26, total: 26 },
  'April': { completed: 8, total: 15 },
  'Mei': { completed: 12, total: 18 },
  'Juni': { completed: 14, total: 20 },
  'Juli': { completed: 3, total: 12 },
  'Agustus': { completed: 0, total: 8 },
  'September': { completed: 0, total: 10 },
  'Oktober': { completed: 0, total: 15 },
  'November': { completed: 0, total: 12 },
  'Desember': { completed: 0, total: 9 }
};

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function MatriksKegiatanOverview() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedId, setSelectedId] = useState('all');

  const handleMonthClick = (month: string) => {
    const monthIndex = months.indexOf(month) + 1;
    const monthParam = month.toLowerCase();
    navigate(`/matriks/calendar/${monthParam}`);
  };

  const resetFilters = () => {
    setSelectedYear('2024');
    setSelectedTeam('all');
    setSelectedId('all');
  };

  const getMonthCardColor = (month: string) => {
    const progress = monthProgress[month];
    const completionRate = progress.completed / progress.total;

    if (completionRate >= 1) return 'bg-green-500';
    if (completionRate >= 0.7) return 'bg-blue-500';
    if (completionRate >= 0.3) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getCurrentMonth = () => {
    const now = new Date();
    return now.getMonth();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 min-w-[100px]"
            >
              <option value="">Tahun</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>

            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 min-w-[100px]"
            >
              <option value="">Tim</option>
              <option value="all">Semua Tim</option>
              <option value="sosial">Tim Sosial</option>
              <option value="ekonomi">Tim Ekonomi</option>
              <option value="produksi">Tim Produksi</option>
              <option value="distribusi">Tim Distribusi</option>
            </select>

            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 min-w-[100px]"
            >
              <option value="">Id_nama</option>
              <option value="all">Semua ID</option>
              <option value="spkk">SPKK</option>
              <option value="sph">SPH</option>
              <option value="susenas">SUSENAS</option>
              <option value="vhts">VHTS</option>
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset Filter
          </button>
        </div>
      </div>

      {/* Month Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {months.map((month, index) => {
          const activities = monthlyActivities[month] || [];
          const isCurrentMonth = index === getCurrentMonth();

          return (
            <div
              key={month}
              onClick={() => handleMonthClick(month)}
              className={`
                relative bg-white p-4 rounded-lg shadow overflow-hidden
                ${isCurrentMonth ? 'ring-2 ring-brand-500' : ''}
              `}
            >
              <div className='absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-purple-100 to-transparent rounded-b-lg'></div>
              <div className='p-4 flex justify-between items-center w-full'>
                <h2 className="text-xl font-bold">{month}</h2>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 
             002-2V7a2 2 0 00-2-2H5a2 2 0 
             00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {/* Activities List */}
              <div className="px-4 relative flex items-center justify-between">
                <div className="space-y-2 mb-4 w-full">
                  {activities.slice(0, 6).map((activity, actIndex) => (
                    <div
                      key={actIndex}
                      className="text-[10px] text-gray-700 py-1 px-2 rounded flex items-center gap-2 hover:bg-gray-100 cursor-default transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-700"></div>
                      <span className="truncate">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
