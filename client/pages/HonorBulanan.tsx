import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  UserPlus,
  AlertTriangle,
  DollarSign,
  Users,
  Calendar,
  X,
  Save,
  Download,
} from "lucide-react";

// Mock data
const teams = [
  { id: 1, name: "Tim Sosial" },
  { id: 2, name: "Tim Ekonomi" },
  { id: 3, name: "Tim Produksi" },
  { id: 4, name: "Tim Distribusi" },
];

const activities = [
  { id: 1, name: "Sensus Penduduk 2024", team_id: 1, max_payment: 5000000 },
  { id: 2, name: "Survei Ekonomi Rumah Tangga", team_id: 2, max_payment: 4500000 },
  { id: 3, name: "Pendataan Harga Konsumen", team_id: 3, max_payment: 3500000 },
  { id: 4, name: "Survei Pertanian", team_id: 4, max_payment: 4000000 },
  { id: 5, name: "Survei Upahan", team_id: 2, max_payment: 3800000 },
];

const availableMitra = [
  { id: 1, name: "Ahmad Subaki", max_monthly_salary: 8000000 },
  { id: 2, name: "Siti Rahmawati", max_monthly_salary: 7500000 },
  { id: 3, name: "Muhammad Iqbal", max_monthly_salary: 8500000 },
  { id: 4, name: "Dewi Sartika", max_monthly_salary: 7000000 },
  { id: 5, name: "Bayu Setiawan", max_monthly_salary: 7200000 },
  { id: 6, name: "Rina Marlina", max_monthly_salary: 6800000 },
  { id: 7, name: "Andi Pratama", max_monthly_salary: 7300000 },
  { id: 8, name: "Lina Handayani", max_monthly_salary: 6900000 },
];

const initialAssignments = [
  {
    id: 1,
    team_id: 1,
    activity_id: 1,
    mitra_id: 1,
    payment: 4800000,
    month: "Januari",
    year: 2024,
    status: "active",
  },
  {
    id: 2,
    team_id: 2,
    activity_id: 2,
    mitra_id: 2,
    payment: 4200000,
    month: "Januari",
    year: 2024,
    status: "active",
  },
  {
    id: 3,
    team_id: 1,
    activity_id: 1,
    mitra_id: 3,
    payment: 4900000,
    month: "Januari",
    year: 2024,
    status: "active",
  },
  {
    id: 4,
    team_id: 3,
    activity_id: 3,
    mitra_id: 4,
    payment: 3400000,
    month: "Januari",
    year: 2024,
    status: "active",
  },
  {
    id: 5,
    team_id: 2,
    activity_id: 5,
    mitra_id: 1,
    payment: 3600000,
    month: "Januari",
    year: 2024,
    status: "active",
  },
];

const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function HonorBulanan() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("Januari");
  const [selectedYear, setSelectedYear] = useState("2024");

  const [assignmentForm, setAssignmentForm] = useState({
    team_id: "",
    activity_id: "",
    mitra_id: "",
    payment: "",
    month: "Januari",
    year: "2024",
  });

  // Filter assignments
  const filteredAssignments = assignments.filter((assignment) => {
    const team = teams.find((t) => t.id === assignment.team_id);
    const activity = activities.find((a) => a.id === assignment.activity_id);
    const mitra = availableMitra.find((m) => m.id === assignment.mitra_id);

    const matchesSearch =
      team?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mitra?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTeam = selectedTeam ? assignment.team_id.toString() === selectedTeam : true;
    const matchesMonth = assignment.month === selectedMonth;
    const matchesYear = assignment.year.toString() === selectedYear;

    return matchesSearch && matchesTeam && matchesMonth && matchesYear;
  });

  // Calculate statistics
  const totalPayments = filteredAssignments.reduce((sum, a) => sum + a.payment, 0);
  const uniqueMitra = new Set(filteredAssignments.map((a) => a.mitra_id)).size;
  const totalActivities = new Set(filteredAssignments.map((a) => a.activity_id)).size;

  // Check salary limits
  const getMitraTotalPayment = (mitraId: number, month: string, year: number) => {
    return assignments
      .filter((a) => a.mitra_id === mitraId && a.month === month && a.year === year)
      .reduce((sum, a) => sum + a.payment, 0);
  };

  const checkSalaryWarning = (mitraId: number, newPayment: number, month: string, year: number) => {
    const mitra = availableMitra.find((m) => m.id === mitraId);
    if (!mitra) return false;

    const currentTotal = getMitraTotalPayment(mitraId, month, year);
    return currentTotal + newPayment > mitra.max_monthly_salary;
  };

  const handleAddAssignment = () => {
    setSelectedAssignment(null);
    setAssignmentForm({
      team_id: "",
      activity_id: "",
      mitra_id: "",
      payment: "",
      month: selectedMonth,
      year: selectedYear,
    });
    setShowAssignmentForm(true);
  };

  const handleEditAssignment = (assignment: any) => {
    setSelectedAssignment(assignment);
    setAssignmentForm({
      team_id: assignment.team_id.toString(),
      activity_id: assignment.activity_id.toString(),
      mitra_id: assignment.mitra_id.toString(),
      payment: assignment.payment.toString(),
      month: assignment.month,
      year: assignment.year.toString(),
    });
    setShowAssignmentForm(true);
  };

  const handleDeleteAssignment = (id: number) => {
    if (confirm("Yakin ingin menghapus penugasan ini?")) {
      setAssignments(assignments.filter((a) => a.id !== id));
    }
  };

  const handleSubmitAssignment = () => {
    const payment = parseInt(assignmentForm.payment);
    const mitraId = parseInt(assignmentForm.mitra_id);

    // Check salary warning
    if (checkSalaryWarning(mitraId, payment, assignmentForm.month, parseInt(assignmentForm.year))) {
      const mitra = availableMitra.find((m) => m.id === mitraId);
      const currentTotal = getMitraTotalPayment(mitraId, assignmentForm.month, parseInt(assignmentForm.year));
      
      if (!confirm(
        `PERINGATAN: Total honor mitra akan melebihi batas maksimum!\n\n` +
        `Mitra: ${mitra?.name}\n` +
        `Batas Maksimum: ${formatCurrency(mitra?.max_monthly_salary || 0)}\n` +
        `Total Saat Ini: ${formatCurrency(currentTotal)}\n` +
        `Honor Baru: ${formatCurrency(payment)}\n` +
        `Total Setelah: ${formatCurrency(currentTotal + payment)}\n\n` +
        `Apakah Anda yakin ingin melanjutkan?`
      )) {
        return;
      }
    }

    if (selectedAssignment) {
      // Update existing assignment
      setAssignments(assignments.map((a) =>
        a.id === selectedAssignment.id
          ? {
              ...a,
              team_id: parseInt(assignmentForm.team_id),
              activity_id: parseInt(assignmentForm.activity_id),
              mitra_id: parseInt(assignmentForm.mitra_id),
              payment: payment,
              month: assignmentForm.month,
              year: parseInt(assignmentForm.year),
            }
          : a
      ));
    } else {
      // Add new assignment
      const newAssignment = {
        id: Math.max(...assignments.map((a) => a.id)) + 1,
        team_id: parseInt(assignmentForm.team_id),
        activity_id: parseInt(assignmentForm.activity_id),
        mitra_id: parseInt(assignmentForm.mitra_id),
        payment: payment,
        month: assignmentForm.month,
        year: parseInt(assignmentForm.year),
        status: "active",
      };
      setAssignments([...assignments, newAssignment]);
    }

    setShowAssignmentForm(false);
    setSelectedAssignment(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Honor Mitra Bulanan</h1>
            <p className="text-brand-100 mt-1">
              Manajemen Penugasan dan Pembayaran Honor Mitra
            </p>
          </div>
          <button
            onClick={handleAddAssignment}
            className="flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Penugasan
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Honor</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPayments)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mitra Aktif</p>
              <p className="text-2xl font-bold text-blue-600">{uniqueMitra}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Kegiatan</p>
              <p className="text-2xl font-bold text-purple-600">{totalActivities}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rata-rata Honor</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(totalPayments / (filteredAssignments.length || 1))}
              </p>
            </div>
            <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-sm">Rp</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari tim, kegiatan, atau mitra..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Semua Tim</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id.toString()}>
                  {team.name}
                </option>
              ))}
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <button className="flex items-center px-4 py-2 text-sm text-white bg-brand-600 rounded-md hover:bg-brand-700 transition-colors">
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kegiatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mitra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Honor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Periode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status Batas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssignments.map((assignment) => {
                const team = teams.find((t) => t.id === assignment.team_id);
                const activity = activities.find((a) => a.id === assignment.activity_id);
                const mitra = availableMitra.find((m) => m.id === assignment.mitra_id);
                const totalMitraPayment = getMitraTotalPayment(assignment.mitra_id, assignment.month, assignment.year);
                const isOverLimit = mitra && totalMitraPayment > mitra.max_monthly_salary;

                return (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{team?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{activity?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-medium mr-3">
                          {mitra?.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{mitra?.name}</div>
                          <div className="text-xs text-gray-500">
                            Total: {formatCurrency(totalMitraPayment)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(assignment.payment)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assignment.month} {assignment.year}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isOverLimit ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Melebihi Batas
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditAssignment(assignment)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAssignment(assignment.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedAssignment ? "Edit Penugasan" : "Tambah Penugasan"}
                </h2>
                <button
                  onClick={() => setShowAssignmentForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tim
                  </label>
                  <select
                    value={assignmentForm.team_id}
                    onChange={(e) => {
                      setAssignmentForm({ ...assignmentForm, team_id: e.target.value, activity_id: "" });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  >
                    <option value="">Pilih Tim</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id.toString()}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kegiatan
                  </label>
                  <select
                    value={assignmentForm.activity_id}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, activity_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                    disabled={!assignmentForm.team_id}
                  >
                    <option value="">Pilih Kegiatan</option>
                    {activities
                      .filter((activity) => activity.team_id.toString() === assignmentForm.team_id)
                      .map((activity) => (
                        <option key={activity.id} value={activity.id.toString()}>
                          {activity.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mitra
                  </label>
                  <select
                    value={assignmentForm.mitra_id}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, mitra_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  >
                    <option value="">Pilih Mitra</option>
                    {availableMitra.map((mitra) => (
                      <option key={mitra.id} value={mitra.id.toString()}>
                        {mitra.name} (Maks: {formatCurrency(mitra.max_monthly_salary)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bulan
                    </label>
                    <select
                      value={assignmentForm.month}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, month: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    >
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tahun
                    </label>
                    <select
                      value={assignmentForm.year}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, year: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    >
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Honor (Rupiah)
                  </label>
                  <input
                    type="number"
                    value={assignmentForm.payment}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, payment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Masukkan jumlah honor"
                    required
                  />
                  {assignmentForm.mitra_id && assignmentForm.payment && (
                    <div className="mt-2">
                      {checkSalaryWarning(
                        parseInt(assignmentForm.mitra_id),
                        parseInt(assignmentForm.payment),
                        assignmentForm.month,
                        parseInt(assignmentForm.year)
                      ) && (
                        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
                          <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                          <div className="text-sm text-red-700">
                            <strong>Peringatan:</strong> Total honor akan melebihi batas maksimum mitra!
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowAssignmentForm(false)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitAssignment}
                  className="flex items-center px-4 py-2 text-sm text-white bg-brand-600 rounded-md hover:bg-brand-700"
                  disabled={!assignmentForm.team_id || !assignmentForm.activity_id || !assignmentForm.mitra_id || !assignmentForm.payment}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {selectedAssignment ? "Update" : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
