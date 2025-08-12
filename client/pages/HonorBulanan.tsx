import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X, Plus, UserPlus, Save, Calendar } from "lucide-react";

// Mock data structure
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
  {
    id: "pertanian",
    label: "Statistik Pertanian, Industri, dan PEK",
    count: 71,
  },
];

const activitiesData = [
  {
    id: 1,
    title: "Pemutakhiran Sakeenas Februari",
    team_id: "rumah_tangga",
    year: "2024",
    month: "februari",
    date: "15",
    honor: 5000000,
    participants: [
      "A816.M.Dahlan_Praya",
      "A815.M.Dahlan_Praya",
      "A816.M.Dahlan_Praya",
      "A815.M.Dahlan_Praya",
    ],
    color: "bg-red-200",
  },
  {
    id: 2,
    title: "Survei Upahan",
    team_id: "rumah_tangga",
    year: "2024",
    month: "februari",
    date: "20",
    honor: 3500000,
    participants: [],
    color: "bg-gray-200",
  },
  {
    id: 3,
    title: "Pendataan Harga Konsumen",
    team_id: "rumah_tangga",
    year: "2024",
    month: "maret",
    date: "10",
    honor: 4200000,
    participants: [],
    color: "bg-gray-200",
  },
  {
    id: 4,
    title: "Pemutakhiran Sakeenas Februari",
    team_id: "pertanian",
    year: "2024",
    month: "februari",
    participants: [],
    color: "bg-gray-200",
  },
  {
    id: 5,
    title: "Pemutakhiran Sakeenas Februari",
    team_id: "pertanian",
    year: "2024",
    month: "maret",
    participants: [],
    color: "bg-gray-200",
  },
  {
    id: 6,
    title: "Pemutakhiran Sakeenas Februari",
    team_id: "pertanian",
    year: "2024",
    month: "april",
    participants: [],
    color: "bg-gray-200",
  },
  {
    id: 7,
    title: "Pemutakhiran Sakeenas Februari",
    team_id: "rumah_tangga",
    year: "2025",
    month: "januari",
    participants: [],
    color: "bg-gray-200",
  },
  {
    id: 8,
    title: "Pemutakhiran Sakeenas Februari",
    team_id: "pertanian",
    year: "2025",
    month: "januari",
    participants: [],
    color: "bg-gray-200",
  },
];

const availableMitra = [
  {
    id: 1,
    name: "A816.M.Dahlan_Praya",
    team: "Statistik Rumah Tangga",
    status: "Tersedia",
  },
  {
    id: 2,
    name: "A815.M.Dahlan_Praya",
    team: "Statistik Rumah Tangga",
    status: "Tersedia",
  },
  {
    id: 3,
    name: "A720.Siti Aminah_Praya",
    team: "Statistik Rumah Tangga",
    status: "Tersedia",
  },
  {
    id: 4,
    name: "A632.Ahmad Fauzi_Jonggat",
    team: "Statistik Pertanian",
    status: "Tersedia",
  },
  {
    id: 5,
    name: "B201.Dewi Sartika_Pujut",
    team: "Statistik Pertanian",
    status: "Tersedia",
  },
  {
    id: 6,
    name: "B301.Bayu Santoso_Kelayu",
    team: "Statistik Pertanian",
    status: "Tersedia",
  },
];

export default function HonorBulanan() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState("semua");
  const [selectedTeam, setSelectedTeam] = useState("rumah_tangga");
  const [showMoreYears, setShowMoreYears] = useState(false);
  const [showMoreMonths, setShowMoreMonths] = useState(false);
  const [showMoreTeams, setShowMoreTeams] = useState(false);
  const [activities, setActivities] = useState(activitiesData);
  const [expandedCards, setExpandedCards] = useState<{
    [key: number]: boolean;
  }>({});
  const [showMitraTable, setShowMitraTable] = useState(false);
  const [showNewActivityModal, setShowNewActivityModal] = useState(false);
  const [newActivityForm, setNewActivityForm] = useState({
    title: "",
    date: "",
    month: "januari",
    year: "2024",
    honor: "",
  });

  // AJAX-like filter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = activitiesData.filter((activity) => {
        const matchesYear = activity.year === selectedYear;
        const matchesTeam = activity.team_id === selectedTeam;
        const matchesMonth =
          selectedMonth === "semua" || activity.month === selectedMonth;
        return matchesYear && matchesTeam && matchesMonth;
      });
      setActivities(filtered);
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedYear, selectedMonth, selectedTeam]);

  const handleRemoveParticipant = (
    activityId: number,
    participantIndex: number,
  ) => {
    setActivities((prev) =>
      prev.map((activity) => {
        if (activity.id === activityId) {
          const newParticipants = activity.participants.filter(
            (_, index) => index !== participantIndex,
          );
          return {
            ...activity,
            participants: newParticipants,
            color: newParticipants.length > 0 ? "bg-red-200" : "bg-gray-200",
          };
        }
        return activity;
      }),
    );
  };

  const handleAddParticipant = (activityId: number, participant: string) => {
    setActivities((prev) =>
      prev.map((activity) => {
        if (activity.id === activityId) {
          const newParticipants = [...activity.participants, participant];
          return {
            ...activity,
            participants: newParticipants,
            color: newParticipants.length > 0 ? "bg-red-200" : "bg-gray-200",
          };
        }
        return activity;
      }),
    );
  };

  const handleAssignMitra = (mitraName: string, activityId: number) => {
    handleAddParticipant(activityId, mitraName);
  };

  const toggleCardExpanded = (cardId: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const selectedYearData = yearsData.find((y) => y.id === selectedYear);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCreateActivity = () => {
    const newActivity = {
      id: Math.max(...activitiesData.map(a => a.id)) + 1,
      title: newActivityForm.title,
      team_id: selectedTeam,
      year: newActivityForm.year,
      month: newActivityForm.month,
      date: newActivityForm.date,
      honor: parseInt(newActivityForm.honor),
      participants: [],
      color: "bg-gray-200",
    };

    setActivities(prev => [...prev, newActivity]);
    setNewActivityForm({
      title: "",
      date: "",
      month: "januari",
      year: "2024",
      honor: "",
    });
    setShowNewActivityModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Sidebar Filters */}
        <div className="w-80 bg-white border-r border-gray-200 p-4 space-y-4 overflow-y-auto h-screen">
          {/* Year Filter */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="bg-gray-100 rounded-lg p-3 mb-3">
              <h3 className="font-medium text-gray-800 text-center text-sm">
                Tahun
              </h3>
            </div>

            <div className="space-y-2">
              {yearsData
                .slice(0, showMoreYears ? yearsData.length : 2)
                .map((year) => (
                  <label
                    key={year.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="year"
                      value={year.id}
                      checked={selectedYear === year.id}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 text-xs">{year.label}</span>
                    {selectedYear === year.id && (
                      <span className="text-xs text-gray-500">
                        ({year.count})
                      </span>
                    )}
                  </label>
                ))}

              <button
                onClick={() => setShowMoreYears(!showMoreYears)}
                className="text-blue-600 text-xs hover:text-blue-800 transition-colors"
              >
                {showMoreYears ? "Lihat Lebih Sedikit" : "Lihat Lebih Banyak"}
              </button>
            </div>
          </div>

          {/* Month Filter */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="bg-gray-100 rounded-lg p-3 mb-3">
              <h3 className="font-medium text-gray-800 text-center text-sm">
                Bulan
              </h3>
            </div>

            <div className="space-y-2">
              {monthsData
                .slice(0, showMoreMonths ? monthsData.length : 4)
                .map((month) => (
                  <label
                    key={month.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="month"
                      value={month.id}
                      checked={selectedMonth === month.id}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 text-xs">{month.label}</span>
                  </label>
                ))}

              <button
                onClick={() => setShowMoreMonths(!showMoreMonths)}
                className="text-blue-600 text-xs hover:text-blue-800 transition-colors"
              >
                {showMoreMonths ? "Lihat Lebih Sedikit" : "Lihat Lebih Banyak"}
              </button>
            </div>
          </div>

          {/* Team Filter */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="bg-gray-100 rounded-lg p-3 mb-3">
              <h3 className="font-medium text-gray-800 text-center text-sm">
                Tim
              </h3>
            </div>

            <div className="space-y-2">
              {teamsData
                .slice(0, showMoreTeams ? teamsData.length : 2)
                .map((team) => (
                  <label
                    key={team.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="team"
                      value={team.id}
                      checked={selectedTeam === team.id}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 text-xs">{team.label}</span>
                    {selectedTeam === team.id && (
                      <span className="text-xs text-gray-500">
                        ({team.count})
                      </span>
                    )}
                  </label>
                ))}

              <button
                onClick={() => setShowMoreTeams(!showMoreTeams)}
                className="text-blue-600 text-xs hover:text-blue-800 transition-colors"
              >
                {showMoreTeams ? "Lihat Lebih Sedikit" : "Lihat Lebih Banyak"}
              </button>
            </div>
          </div>

          {/* Tambah Mitra Button */}
          <button
            onClick={() => setShowMitraTable(!showMitraTable)}
            className={`w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              showMitraTable
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {showMitraTable ? "Tutup Tabel Mitra" : "Tambah Mitra"}
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
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
                  <div className="flex items-center justify-between mb-2">
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
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-gray-600">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="capitalize">{activity.month} {activity.year}</span>
                      {activity.date && <span className="ml-1">- Tanggal {activity.date}</span>}
                    </div>
                    <div className="text-xs font-semibold text-green-600">
                      Honor: {formatCurrency(activity.honor || 0)}
                    </div>
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
                        <span className="text-xs text-gray-700">
                          {participant}
                        </span>
                        <button
                          onClick={() =>
                            handleRemoveParticipant(activity.id, index)
                          }
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Hapus mitra"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}

                    {activity.participants.length === 0 && (
                      <div className="text-center py-3">
                        <span className="text-xs text-gray-500">
                          Belum ada mitra
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Expanded Content */}
                  {expandedCards[activity.id] && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700">
                          Tambah Mitra:
                        </label>
                        <select
                          onChange={(e) => {
                            if (
                              e.target.value &&
                              !activity.participants.includes(e.target.value)
                            ) {
                              handleAddParticipant(activity.id, e.target.value);
                              e.target.value = "";
                            }
                          }}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Pilih mitra...</option>
                          {availableMitra
                            .filter(
                              (mitra) =>
                                !activity.participants.includes(mitra.name),
                            )
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
            <div
              onClick={() => setShowNewActivityModal(true)}
              className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center min-h-[150px] hover:border-gray-400 transition-colors cursor-pointer"
            >
              <div className="text-center">
                <Plus className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <span className="text-gray-500 text-xs">
                  Tambah Kegiatan Baru
                </span>
              </div>
            </div>
          </div>

          {/* Mitra Table */}
          {showMitraTable && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Daftar Mitra Tersedia
                </h3>
                <p className="text-sm text-gray-600">
                  Pilih mitra untuk ditugaskan ke kegiatan
                </p>
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
                              <div className="text-sm font-medium text-gray-900">
                                {mitra.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {mitra.team}
                          </div>
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
                                handleAssignMitra(
                                  mitra.name,
                                  parseInt(e.target.value),
                                );
                                e.target.value = "";
                              }
                            }}
                            className="px-3 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Assign ke...</option>
                            {activities.map((activity) => (
                              <option
                                key={activity.id}
                                value={activity.id.toString()}
                              >
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
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-blue-600">
                    {activities.length}
                  </div>
                  <div className="text-xs text-gray-600">Total Kegiatan</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600">
                    {activities.reduce(
                      (sum, activity) => sum + activity.participants.length,
                      0,
                    )}
                  </div>
                  <div className="text-xs text-gray-600">
                    Total Mitra Terlibat
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-600">
                    {selectedYearData?.count || 0}
                  </div>
                  <div className="text-xs text-gray-600">
                    Kegiatan Tahun {selectedYear}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {activities.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Plus className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada kegiatan
              </h3>
              <p className="text-gray-500 mb-4">
                Tidak ada kegiatan yang ditemukan untuk filter yang dipilih.
              </p>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kegiatan Pertama
              </button>
            </div>
          )}

          {/* New Activity Modal */}
          {showNewActivityModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Tambah Kegiatan Baru
                    </h2>
                    <button
                      onClick={() => setShowNewActivityModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Kegiatan
                      </label>
                      <input
                        type="text"
                        value={newActivityForm.title}
                        onChange={(e) => setNewActivityForm({ ...newActivityForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan nama kegiatan"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={newActivityForm.date}
                          onChange={(e) => setNewActivityForm({ ...newActivityForm, date: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="1-31"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bulan
                        </label>
                        <select
                          value={newActivityForm.month}
                          onChange={(e) => setNewActivityForm({ ...newActivityForm, month: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          {monthsData.filter(m => m.id !== "semua").map((month) => (
                            <option key={month.id} value={month.id}>
                              {month.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tahun
                        </label>
                        <select
                          value={newActivityForm.year}
                          onChange={(e) => setNewActivityForm({ ...newActivityForm, year: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="2024">2024</option>
                          <option value="2025">2025</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Honor Mitra (Rupiah)
                      </label>
                      <input
                        type="number"
                        value={newActivityForm.honor}
                        onChange={(e) => setNewActivityForm({ ...newActivityForm, honor: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan jumlah honor"
                        required
                      />
                      {newActivityForm.honor && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatCurrency(parseInt(newActivityForm.honor) || 0)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
                    <button
                      onClick={() => setShowNewActivityModal(false)}
                      className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleCreateActivity}
                      className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      disabled={!newActivityForm.title || !newActivityForm.honor}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Simpan Kegiatan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
