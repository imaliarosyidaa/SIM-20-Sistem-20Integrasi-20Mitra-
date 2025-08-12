import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  UserPlus,
} from "lucide-react";

// Mock data structure matching the image
const yearsData = [
  { id: "2025", label: "2025", count: 12 },
  { id: "2024", label: "2024", count: 156 },
];

const monthsData = [
  { id: "semua", label: "Semua" },
  { id: "januari", label: "Januari" },
  { id: "februari", label: "Februari" },
  { id: "maret", label: "Maret" },
  { id: "april", label: "April" },
  { id: "mei", label: "Mei" },
  { id: "juni", label: "Juni" },
  { id: "juli", label: "Juli" },
  { id: "agustus", label: "Agustus" },
  { id: "september", label: "September" },
  { id: "oktober", label: "Oktober" },
  { id: "november", label: "November" },
  { id: "desember", label: "Desember" },
];

const teamsData = [
  { id: "rumah_tangga", label: "Statistik Rumah Tangga", count: 85 },
  { id: "pertanian", label: "Statistik Pertanian, Industri, dan PEK", count: 71 },
];

const activitiesData = [
  {
    id: 1,
    title: "Pemutakhiran Sakeenas Februari",
    team_id: "rumah_tangga",
    year: "2024",
    month: "februari",
    participants: [
      "A816.M.Dahlan_Praya",
      "A815.M.Dahlan_Praya",
      "A816.M.Dahlan_Praya",
      "A815.M.Dahlan_Praya"
    ],
    color: "bg-red-200"
  },
  {
    id: 2,
    title: "Pemutakhiran Sakeenas Februari",
    team_id: "rumah_tangga",
    year: "2024",
    month: "februari",
    participants: [],
    color: "bg-gray-200"
  },
  {
    id: 3,
    title: "Pemutakhiran Sakeenas Februari",
    team_id: "rumah_tangga",
    year: "2024",
    month: "maret",
    participants: [],
    color: "bg-gray-200"
  },
  {
    id: 4,
    title: "Pemutakhiran Sakeenas Februari",
    team_id: "pertanian",
    year: "2024",
    month: "februari",
    participants: [],
    color: "bg-gray-200"
  },
  {
    id: 5,
    title: "Pemutakhiran Sakeenas Februari",
    team_id: "pertanian",
    year: "2024",
    month: "maret",
    participants: [],
    color: "bg-gray-200"
  },
  {
    id: 6,
    title: "Pemutakhiran Sakeenas Februari",
    team_id: "pertanian",
    year: "2024",
    month: "april",
    participants: [],
    color: "bg-gray-200"
  },
  {
    id: 7,
    title: "Pemutakhiran Sakeenas Februari",
    team_id: "rumah_tangga",
    year: "2025",
    month: "januari",
    participants: [],
    color: "bg-gray-200"
  },
  {
    id: 8,
    title: "Pemutakhiran Sakeenas Februari",
    team_id: "pertanian",
    year: "2025",
    month: "januari",
    participants: [],
    color: "bg-gray-200"
  },
];

const availableMitra = [
  { id: 1, name: "A816.M.Dahlan_Praya", team: "Statistik Rumah Tangga", status: "Tersedia" },
  { id: 2, name: "A815.M.Dahlan_Praya", team: "Statistik Rumah Tangga", status: "Tersedia" },
  { id: 3, name: "A720.Siti Aminah_Praya", team: "Statistik Rumah Tangga", status: "Tersedia" },
  { id: 4, name: "A632.Ahmad Fauzi_Jonggat", team: "Statistik Pertanian", status: "Tersedia" },
  { id: 5, name: "B201.Dewi Sartika_Pujut", team: "Statistik Pertanian", status: "Tersedia" },
  { id: 6, name: "B301.Bayu Santoso_Kelayu", team: "Statistik Pertanian", status: "Tersedia" },
];

export default function HonorBulanan() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState("semua");
  const [selectedTeam, setSelectedTeam] = useState("rumah_tangga");
  const [showMoreYears, setShowMoreYears] = useState(false);
  const [showMoreMonths, setShowMoreMonths] = useState(false);
  const [showMoreTeams, setShowMoreTeams] = useState(false);
  const [activities, setActivities] = useState(activitiesData);
  const [expandedCards, setExpandedCards] = useState<{[key: number]: boolean}>({});
  const [showMitraTable, setShowMitraTable] = useState(false);

  // AJAX-like filter effect - updates immediately when filters change
  useEffect(() => {
    // Simulate real-time filtering
    const timer = setTimeout(() => {
      // Filter activities based on selected year, month, and team
      const filtered = activitiesData.filter(activity => {
        const matchesYear = activity.year === selectedYear;
        const matchesTeam = activity.team_id === selectedTeam;
        const matchesMonth = selectedMonth === "semua" || activity.month === selectedMonth;
        return matchesYear && matchesTeam && matchesMonth;
      });
      setActivities(filtered);
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedYear, selectedMonth, selectedTeam]);

  const handleRemoveParticipant = (activityId: number, participantIndex: number) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        const newParticipants = activity.participants.filter((_, index) => index !== participantIndex);
        return {
          ...activity,
          participants: newParticipants,
          color: newParticipants.length > 0 ? "bg-red-200" : "bg-gray-200"
        };
      }
      return activity;
    }));
  };

  const handleAddParticipant = (activityId: number, participant: string) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        const newParticipants = [...activity.participants, participant];
        return {
          ...activity,
          participants: newParticipants,
          color: newParticipants.length > 0 ? "bg-red-200" : "bg-gray-200"
        };
      }
      return activity;
    }));
  };

  const toggleCardExpanded = (cardId: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const selectedYearData = yearsData.find(y => y.id === selectedYear);
  const selectedTeamData = teamsData.find(t => t.id === selectedTeam);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Filters Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Year Filter */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-800 text-center">Tahun</h3>
            </div>
            
            <div className="space-y-3">
              {yearsData.slice(0, showMoreYears ? yearsData.length : 2).map((year) => (
                <label key={year.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="year"
                    value={year.id}
                    checked={selectedYear === year.id}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{year.label}</span>
                  {selectedYear === year.id && (
                    <span className="text-sm text-gray-500">({year.count})</span>
                  )}
                </label>
              ))}
              
              <button
                onClick={() => setShowMoreYears(!showMoreYears)}
                className="text-blue-600 text-sm hover:text-blue-800 transition-colors"
              >
                {showMoreYears ? "Lihat Lebih Sedikit" : "Lihat Lebih Banyak"}
              </button>
            </div>
          </div>

          {/* Team Filter */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-800 text-center">Tim</h3>
            </div>
            
            <div className="space-y-3">
              {teamsData.slice(0, showMoreTeams ? teamsData.length : 2).map((team) => (
                <label key={team.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="team"
                    value={team.id}
                    checked={selectedTeam === team.id}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 text-sm">{team.label}</span>
                  {selectedTeam === team.id && (
                    <span className="text-sm text-gray-500">({team.count})</span>
                  )}
                </label>
              ))}
              
              <button
                onClick={() => setShowMoreTeams(!showMoreTeams)}
                className="text-blue-600 text-sm hover:text-blue-800 transition-colors"
              >
                {showMoreTeams ? "Lihat Lebih Sedikit" : "Lihat Lebih Banyak"}
              </button>
            </div>
          </div>
        </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`${activity.color} rounded-lg border shadow-sm transition-all duration-200 hover:shadow-md`}
              >
                {/* Card Header with Dropdown */}
                <div
                  className="p-3 cursor-pointer"
                  onClick={() => toggleCardExpanded(activity.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800 text-sm leading-tight">
                      {activity.title}
                    </h3>
                    <button className="text-gray-600 hover:text-gray-800 transition-colors">
                      {expandedCards[activity.id] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Participants List */}
                <div className="px-3 pb-3">
                  <div className="space-y-1">
                    {activity.participants.map((participant, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white/50 rounded px-2 py-1"
                      >
                        <span className="text-xs text-gray-700">{participant}</span>
                        <button
                          onClick={() => handleRemoveParticipant(activity.id, index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Hapus mitra"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}

                    {activity.participants.length === 0 && (
                      <div className="text-center py-3">
                        <span className="text-xs text-gray-500">Belum ada mitra</span>
                      </div>
                    )}
                  </div>

                  {/* Expanded Content - Add Participant */}
                  {expandedCards[activity.id] && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700">
                          Tambah Mitra:
                        </label>
                        <select
                          onChange={(e) => {
                            if (e.target.value && !activity.participants.includes(e.target.value)) {
                              handleAddParticipant(activity.id, e.target.value);
                              e.target.value = "";
                            }
                          }}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Pilih mitra...</option>
                          {availableMitra
                            .filter(mitra => !activity.participants.includes(mitra.name))
                            .map((mitra) => (
                              <option key={mitra.id} value={mitra.name}>
                                {mitra.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Add New Activity Card */}
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center min-h-[150px] hover:border-gray-400 transition-colors cursor-pointer">
              <div className="text-center">
                <Plus className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <span className="text-gray-500 text-xs">Tambah Kegiatan Baru</span>
              </div>
            </div>
          </div>

          {/* Mitra Table */}
          {showMitraTable && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Daftar Mitra Tersedia</h3>
                <p className="text-sm text-gray-600">Pilih mitra untuk ditugaskan ke kegiatan</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Mitra
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tim
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {availableMitra.map((mitra) => (
                      <tr key={mitra.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-medium mr-3">
                              {mitra.name.split(".")[0] || mitra.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{mitra.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{mitra.team}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {mitra.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAssignMitra(mitra.name, parseInt(e.target.value));
                                e.target.value = "";
                              }
                            }}
                            className="px-3 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                          >
                            <option value="">Assign ke...</option>
                            {activities.map((activity) => (
                              <option key={activity.id} value={activity.id.toString()}>
                                {activity.title}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* Summary Stats */}
        {activities.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {activities.length}
                </div>
                <div className="text-sm text-gray-600">Total Kegiatan</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {activities.reduce((sum, activity) => sum + activity.participants.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Mitra Terlibat</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {selectedYearData?.count || 0}
                </div>
                <div className="text-sm text-gray-600">
                  Kegiatan Tahun {selectedYear}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {activities.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum ada kegiatan
            </h3>
            <p className="text-gray-500 mb-6">
              Tidak ada kegiatan yang ditemukan untuk filter yang dipilih.
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kegiatan Pertama
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
