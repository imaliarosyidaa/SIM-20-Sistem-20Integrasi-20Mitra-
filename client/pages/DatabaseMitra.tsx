import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Users,
  User,
  MapPin,
  Calendar,
  Phone,
  Mail,
  IdCard,
} from "lucide-react";

// Mock data untuk mitra
const mitraData = [
  {
    id: 1,
    nama: "Ahmad Subaki",
    nik: "5203040101850001",
    gender: "Laki-laki",
    kecamatan: "Praya",
    desa: "Praya Timur",
    alamat: "Jl. Raya Praya No. 123",
    telpon: "08123456789",
    email: "ahmad.subaki@email.com",
    tahun_bergabung: 2020,
    status: "Aktif",
    kegiatan_terakhir: "Sensus Penduduk 2024",
    rating: 4.8,
  },
  {
    id: 2,
    nama: "Siti Rahmawati",
    nik: "5203040201900002",
    gender: "Perempuan",
    kecamatan: "Praya",
    desa: "Praya Barat",
    alamat: "Jl. Ahmad Yani No. 45",
    telpon: "08234567890",
    email: "siti.rahmawati@email.com",
    tahun_bergabung: 2019,
    status: "Aktif",
    kegiatan_terakhir: "Survei Ekonomi 2024",
    rating: 4.7,
  },
  {
    id: 3,
    nama: "Muhammad Iqbal",
    nik: "5203041501920003",
    gender: "Laki-laki",
    kecamatan: "Praya Timur",
    desa: "Kelayu",
    alamat: "Jl. Diponegoro No. 67",
    telpon: "08345678901",
    email: "muhammad.iqbal@email.com",
    tahun_bergabung: 2021,
    status: "Aktif",
    kegiatan_terakhir: "Pendataan Harga 2024",
    rating: 4.9,
  },
  {
    id: 4,
    nama: "Dewi Sartika",
    nik: "5203040801880004",
    gender: "Perempuan",
    kecamatan: "Praya Barat",
    desa: "Mantang",
    alamat: "Jl. Gajah Mada No. 89",
    telpon: "08456789012",
    email: "dewi.sartika@email.com",
    tahun_bergabung: 2018,
    status: "Aktif",
    kegiatan_terakhir: "Survei Pertanian 2024",
    rating: 4.6,
  },
  {
    id: 5,
    nama: "Bayu Setiawan",
    nik: "5203041205950005",
    gender: "Laki-laki",
    kecamatan: "Pujut",
    desa: "Kuta",
    alamat: "Jl. Pantai Kuta No. 12",
    telpon: "08567890123",
    email: "bayu.setiawan@email.com",
    tahun_bergabung: 2022,
    status: "Aktif",
    kegiatan_terakhir: "Sensus Ekonomi 2024",
    rating: 4.5,
  },
  {
    id: 6,
    nama: "Rina Marlina",
    nik: "5203040309850006",
    gender: "Perempuan",
    kecamatan: "Jonggat",
    desa: "Penujak",
    alamat: "Jl. Sudirman No. 34",
    telpon: "08678901234",
    email: "rina.marlina@email.com",
    tahun_bergabung: 2020,
    status: "Non-Aktif",
    kegiatan_terakhir: "Survei Upahan 2023",
    rating: 4.4,
  },
  {
    id: 7,
    nama: "Andi Pratama",
    nik: "5203041008870007",
    gender: "Laki-laki",
    kecamatan: "Pujut",
    desa: "Sengkol",
    alamat: "Jl. Lombok No. 56",
    telpon: "08789012345",
    email: "andi.pratama@email.com",
    tahun_bergabung: 2019,
    status: "Aktif",
    kegiatan_terakhir: "Pendataan IBS 2024",
    rating: 4.3,
  },
  {
    id: 8,
    nama: "Lina Handayani",
    nik: "5203040705900008",
    gender: "Perempuan",
    kecamatan: "Praya Timur",
    desa: "Bagik Payung",
    alamat: "Jl. Hasanuddin No. 78",
    telpon: "08890123456",
    email: "lina.handayani@email.com",
    tahun_bergabung: 2021,
    status: "Aktif",
    kegiatan_terakhir: "Survei Sosial 2024",
    rating: 4.2,
  },
];

const kecamatanList = [
  "Praya",
  "Praya Timur",
  "Praya Barat",
  "Pujut",
  "Jonggat",
  "Batukliang",
  "Batukliang Utara",
  "Kopang",
  "Janapria",
];

export default function DatabaseMitra() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedTahun, setSelectedTahun] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter data berdasarkan kriteria
  const filteredData = mitraData.filter((mitra) => {
    const matchesSearch =
      mitra.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mitra.nik.includes(searchQuery) ||
      mitra.desa.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesKecamatan = selectedKecamatan
      ? mitra.kecamatan === selectedKecamatan
      : true;

    const matchesTahun = selectedTahun
      ? mitra.tahun_bergabung.toString() === selectedTahun
      : true;

    const matchesStatus = selectedStatus ? mitra.status === selectedStatus : true;

    const matchesGender = selectedGender ? mitra.gender === selectedGender : true;

    return (
      matchesSearch &&
      matchesKecamatan &&
      matchesTahun &&
      matchesStatus &&
      matchesGender
    );
  });

  // Statistik gender
  const totalMitra = filteredData.length;
  const lakiLaki = filteredData.filter((m) => m.gender === "Laki-laki").length;
  const perempuan = filteredData.filter((m) => m.gender === "Perempuan").length;
  const mitraAktif = filteredData.filter((m) => m.status === "Aktif").length;

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedKecamatan("");
    setSelectedTahun("");
    setSelectedStatus("");
    setSelectedGender("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Database Mitra</h1>
            <p className="text-brand-100 mt-1">
              Manajemen Data Mitra Statistik BPS Lombok Tengah
            </p>
          </div>
          <button className="flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Mitra
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari nama, NIK, atau desa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetFilters}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Reset Filter
                </button>
                <button className="flex items-center px-4 py-2 text-sm text-white bg-brand-600 rounded-md hover:bg-brand-700 transition-colors">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Mitra</p>
                  <p className="text-2xl font-bold text-gray-900">{totalMitra}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Mitra Aktif</p>
                  <p className="text-2xl font-bold text-green-600">{mitraAktif}</p>
                </div>
                <User className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Laki-laki</p>
                  <p className="text-2xl font-bold text-blue-600">{lakiLaki}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">♂</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Perempuan</p>
                  <p className="text-2xl font-bold text-pink-600">{perempuan}</p>
                </div>
                <div className="h-8 w-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-pink-600 font-bold">♀</span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mitra
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lokasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kontak
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.map((mitra) => (
                    <tr key={mitra.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-medium">
                            {mitra.nama
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {mitra.nama}
                            </div>
                            <div className="text-sm text-gray-500">
                              {mitra.gender} • {mitra.nik}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {mitra.kecamatan}
                        </div>
                        <div className="text-sm text-gray-500">{mitra.desa}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{mitra.telpon}</div>
                        <div className="text-sm text-gray-500">{mitra.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            mitra.status === "Aktif"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {mitra.status}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Bergabung {mitra.tahun_bergabung}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(mitra.rating)
                                    ? "text-yellow-400"
                                    : "text-gray-200"
                                }`}
                              >
                                ★
                              </div>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {mitra.rating}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Menampilkan {startIndex + 1} sampai{" "}
                  {Math.min(startIndex + itemsPerPage, filteredData.length)} dari{" "}
                  {filteredData.length} data
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                  >
                    Sebelumnya
                  </button>
                  <span className="px-3 py-1 text-sm">
                    {currentPage} dari {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(currentPage + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Filter</h3>
            </div>

            <div className="space-y-4">
              {/* Kecamatan Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kecamatan
                </label>
                <select
                  value={selectedKecamatan}
                  onChange={(e) => setSelectedKecamatan(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Semua Kecamatan</option>
                  {kecamatanList.map((kecamatan) => (
                    <option key={kecamatan} value={kecamatan}>
                      {kecamatan}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tahun Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun Bergabung
                </label>
                <select
                  value={selectedTahun}
                  onChange={(e) => setSelectedTahun(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Semua Tahun</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                  <option value="2018">2018</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Semua Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Non-Aktif">Non-Aktif</option>
                </select>
              </div>

              {/* Gender Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Kelamin
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Semua</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            {/* Gender Statistics */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Statistik Gender
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Laki-laki</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {lakiLaki}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Perempuan</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {perempuan}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Total
                    </span>
                    <span className="text-sm font-bold text-brand-600">
                      {totalMitra}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
