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
    return now.getMonth(); // 0-based index
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
          const progress = monthProgress[month];
          const isCurrentMonth = index === getCurrentMonth();
          const isPastMonth = index < getCurrentMonth();
          const cardColor = getMonthCardColor(month);
          
          return (
            <div 
              key={month}
              onClick={() => handleMonthClick(month)}
              className={`
                bg-white rounded-lg shadow-sm border cursor-pointer transition-all duration-200 
                hover:shadow-md hover:scale-105 overflow-hidden
                ${isCurrentMonth ? 'ring-2 ring-brand-500' : ''}
              `}
            >
              {/* Month Header */}
              <div className={`${cardColor} text-white p-4`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{month}</h3>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    {isCurrentMonth && (
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs">Aktif</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Activities List */}
              <div className="p-4">
                <div className="space-y-2 mb-4">
                  {activities.slice(0, 6).map((activity, actIndex) => (
                    <div 
                      key={actIndex}
                      className="text-sm text-gray-700 py-1 px-2 bg-gray-50 rounded flex items-center justify-between hover:bg-gray-100 transition-colors"
                    >
                      <span className="truncate">{activity}</span>
                      {actIndex < 3 && (
                        <div className="ml-2 flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      )}
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
