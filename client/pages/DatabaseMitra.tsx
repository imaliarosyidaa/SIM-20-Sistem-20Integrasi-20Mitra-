import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Users,
  User,
  MapPin,
  Calendar,
  ChevronDown,
  X,
} from "lucide-react";
import Hottable from "@components/ui/Hottable";
import axios from '../lib/api';

export default function DatabaseMitra() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedTahun, setSelectedTahun] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [mitraData, setMitraData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const kecamatanList = useMemo(() => [
    "Praya", "Praya Timur", "Praya Barat", "Pujut", "Jonggat",
    "Batukliang", "Batukliang Utara", "Kopang", "Janapria",
  ], []);
  
  const tahunList = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 10; i--) {
      years.push(String(i));
    }
    return years;
  }, []);
  
  // Fetch data dari API
  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get('/mitra');
        if (Array.isArray(res.data.data)) {
          const formatted = res.data.data.map((mitra) => [
            mitra.namaLengkap,
            mitra.sobatId,
            mitra.jenisKelamin,
            mitra.alamatKec,
            mitra.alamatDesa,
            mitra.alamatDetail,
            mitra.noTelp,
            mitra.email,
            mitra.pekerjaan,
            mitra.statusSeleksi,
            mitra.tahun_bergabung, // Kolom tahun yang hilang
            mitra.rating || 0
          ]);
          setMitraData(formatted);
        } else {
          setMitraData([]);
        }
      } catch (err) {
        setError("Gagal mengambil data. Silakan coba lagi.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    getData();
  }, []);

  // Memperbaiki filter untuk mencocokkan data
  const filteredData = useMemo(() => {
    return mitraData.filter((mitra) => {
      // Pastikan data memiliki indeks yang benar, terutama untuk tahun dan status
      const [
        namaLengkap,
        sobatId,
        jenisKelamin,
        alamatKec,
        alamatDesa,
        alamatDetail,
        noTelp,
        email,
        pekerjaan,
        statusSeleksi,
        tahunBergabung,
      ] = mitra;

      const lowerCaseQuery = searchQuery.toLowerCase();

      const matchesSearch =
        namaLengkap?.toLowerCase().includes(lowerCaseQuery) ||
        sobatId?.toLowerCase().includes(lowerCaseQuery) ||
        alamatDesa?.toLowerCase().includes(lowerCaseQuery);

      const matchesKecamatan = selectedKecamatan
        ? alamatKec === selectedKecamatan
        : true;
      
      const matchesTahun = selectedTahun
        ? String(tahunBergabung) === selectedTahun // Konversi ke string agar cocok
        : true;

      const matchesStatus = selectedStatus
        ? statusSeleksi === selectedStatus
        : true;
      
      const matchesGender = selectedGender
        ? jenisKelamin === selectedGender
        : true;

      return (
        matchesSearch &&
        matchesKecamatan &&
        matchesTahun &&
        matchesStatus &&
        matchesGender
      );
    });
  }, [mitraData, searchQuery, selectedKecamatan, selectedTahun, selectedStatus, selectedGender]);

  // Handle Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = useMemo(() => filteredData.slice(startIndex, startIndex + itemsPerPage), [filteredData, startIndex, itemsPerPage]);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedKecamatan("");
    setSelectedTahun("");
    setSelectedStatus(""); // Reset status juga
    setSelectedGender("");
    setCurrentPage(1);
  }, []);

  // Membantu mengelola state dropdown, menutup yang lain
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdownToggle = (dropdownName) => {
    setOpenDropdown(prev => prev === dropdownName ? null : dropdownName);
  };
  
  const isDropdownOpen = (dropdownName) => openDropdown === dropdownName;

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama, Sobat ID, atau desa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2">
              {/* Kecamatan Filter */}
              <div className="relative">
                <button
                  onClick={() => handleDropdownToggle("kecamatan")}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    selectedKecamatan ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  title="Filter Kecamatan"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  {selectedKecamatan || "Kecamatan"}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </button>
                {isDropdownOpen("kecamatan") && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[200px]">
                    <div className="py-1">
                      <button
                        onClick={() => {setSelectedKecamatan(""); handleDropdownToggle(null)}}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${!selectedKecamatan ? "bg-brand-50 text-brand-600" : ""}`}
                      >
                        Semua Kecamatan
                      </button>
                      {kecamatanList.map((kecamatan) => (
                        <button
                          key={kecamatan}
                          onClick={() => {setSelectedKecamatan(kecamatan); handleDropdownToggle(null)}}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${selectedKecamatan === kecamatan ? "bg-brand-50 text-brand-600" : ""}`}
                        >
                          {kecamatan}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tahun Filter */}
              <div className="relative">
                <button
                  onClick={() => handleDropdownToggle("tahun")}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    selectedTahun ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  title="Filter Tahun"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  {selectedTahun || "Tahun"}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </button>
                {isDropdownOpen("tahun") && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[150px]">
                    <div className="py-1">
                      <button
                        onClick={() => {setSelectedTahun(""); handleDropdownToggle(null)}}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${!selectedTahun ? "bg-brand-50 text-brand-600" : ""}`}
                      >
                        Semua Tahun
                      </button>
                      {tahunList.map((tahun) => (
                        <button
                          key={tahun}
                          onClick={() => {setSelectedTahun(tahun); handleDropdownToggle(null)}}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${selectedTahun === tahun ? "bg-brand-50 text-brand-600" : ""}`}
                        >
                          {tahun}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() => handleDropdownToggle("status")}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    selectedStatus ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  title="Filter Status"
                >
                  <Users className="h-4 w-4 mr-1" />
                  {selectedStatus || "Status"}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </button>
                {isDropdownOpen("status") && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[150px]">
                    <div className="py-1">
                      <button
                        onClick={() => {setSelectedStatus(""); handleDropdownToggle(null)}}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${!selectedStatus ? "bg-brand-50 text-brand-600" : ""}`}
                      >
                        Semua Status
                      </button>
                      <button
                        onClick={() => {setSelectedStatus("Aktif"); handleDropdownToggle(null)}}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${selectedStatus === "Aktif" ? "bg-brand-50 text-brand-600" : ""}`}
                      >
                        Aktif
                      </button>
                      <button
                        onClick={() => {setSelectedStatus("Non-Aktif"); handleDropdownToggle(null)}}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${selectedStatus === "Non-Aktif" ? "bg-brand-50 text-brand-600" : ""}`}
                      >
                        Non-Aktif
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Gender Filter */}
              <div className="relative">
                <button
                  onClick={() => handleDropdownToggle("gender")}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    selectedGender ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  title="Filter Jenis Kelamin"
                >
                  <User className="h-4 w-4 mr-1" />
                  {selectedGender || "Gender"}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </button>
                {isDropdownOpen("gender") && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[150px]">
                    <div className="py-1">
                      <button
                        onClick={() => {setSelectedGender(""); handleDropdownToggle(null)}}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${!selectedGender ? "bg-brand-50 text-brand-600" : ""}`}
                      >
                        Semua
                      </button>
                      <button
                        onClick={() => {setSelectedGender("Laki-laki"); handleDropdownToggle(null)}}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${selectedGender === "Laki-laki" ? "bg-brand-50 text-brand-600" : ""}`}
                      >
                        Laki-laki
                      </button>
                      <button
                        onClick={() => {setSelectedGender("Perempuan"); handleDropdownToggle(null)}}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${selectedGender === "Perempuan" ? "bg-brand-50 text-brand-600" : ""}`}
                      >
                        Perempuan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              title="Reset Semua Filter"
            >
              <X className="h-4 w-4 mr-1" />
              Reset
            </button>
            <button className="flex items-center px-4 py-2 text-sm text-white bg-brand-600 rounded-md hover:bg-brand-700 transition-colors" title="Export Data ke CSV/Excel">
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
      </div>
      
      {/* Data Table with Handsontable */}
        <div className="pt-4">
          <Hottable
            data={currentData}
            colHeaders={[
              "Nama",
              "Sobat ID",
              "Gender",
              "Kecamatan",
              "Desa",
              "Alamat",
              "Telepon",
              "Email",
              "Pekerjaan",
              "Status",
              "Tahun Bergabung",
              "Rating"
            ]}
            columns={[
              { data: 0, readOnly: true },
              { data: 1, readOnly: true },
              { data: 2, readOnly: true },
              { data: 3, readOnly: true },
              { data: 4, readOnly: true },
              { data: 5, readOnly: true },
              { data: 6, readOnly: true },
              { data: 7, readOnly: true },
              { data: 8, readOnly: true },
              { data: 9, readOnly: true },
              { data: 10, readOnly: true },
              { data: 11, readOnly: true },
            ]}
            width="100%"
            height={400}
            manualRowResize={true}
            manualColumnResize={true}
            contextMenu={true}
            filters={true}
            dropdownMenu={true}
            className="database-mitra-table"
          />
        </div>
      </div>
    </div>
  );
}