import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Star,
  Plus,
  Filter,
  Search,
  Download,
  Eye,
  Edit,
  X,
  Save,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Hottable from "@components/ui/Hottable";
import axios from '../lib/api';

export default function EvaluasiMitra() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"highest" | "lowest" | "name">("highest");
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [selectedMitra, setSelectedMitra] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [mitraData, setMitraData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state untuk evaluasi (tetap ada untuk modal)
  const [evaluationForm, setEvaluationForm] = useState({
    kualitas_data: 5,
    ketepatan_waktu: 5,
    komunikasi: 5,
    profesionalisme: 5,
    keterangan: "",
    evaluator: "",
  });

  // Fetch data dari API
  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get('/mitra');
        if (Array.isArray(res.data.data)) {
          // Hanya ambil data yang diperlukan
          const formatted = res.data.data.map((mitra) => ({
            nama: mitra.namaLengkap,
            sobatId: mitra.sobatId,
            kecamatan: mitra.alamatKec,
            desa: mitra.alamatDesa,
            rating: mitra.rating || 0, // Gunakan rating dari API, default 0
            // Simpan data asli jika perlu untuk form evaluasi
            fullMitraData: mitra,
          }));
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

  // Filter dan sorting data
  const filteredData = useMemo(() => {
    return mitraData
      .filter((mitra) =>
        mitra.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mitra.sobatId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mitra.kecamatan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mitra.desa?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "highest":
            return b.rating - a.rating;
          case "lowest":
            return a.rating - b.rating;
          case "name":
            return a.nama.localeCompare(b.nama);
          default:
            return 0;
        }
      });
  }, [mitraData, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = useMemo(() => filteredData.slice(startIndex, startIndex + itemsPerPage), [filteredData, startIndex, itemsPerPage]);

  const handleEvaluate = (mitra: any) => {
    setSelectedMitra(mitra);
    // Reset form dengan nilai default atau dari data mitra yang ada
    setEvaluationForm({
      kualitas_data: mitra.fullMitraData.kualitas_data || 5,
      ketepatan_waktu: mitra.fullMitraData.ketepatan_waktu || 5,
      komunikasi: mitra.fullMitraData.komunikasi || 5,
      profesionalisme: mitra.fullMitraData.profesionalisme || 5,
      keterangan: mitra.fullMitraData.keterangan || "",
      evaluator: mitra.fullMitraData.evaluator || "",
    });
    setShowEvaluationForm(true);
  };

  const submitEvaluation = () => {
    // Di sini Anda akan mengirim data evaluasi ke API
    console.log(`Submitting evaluation for ${selectedMitra.nama}:`, evaluationForm);
    // Aksi selanjutnya (misalnya, memperbarui data lokal atau me-refresh data)
    setShowEvaluationForm(false);
    setSelectedMitra(null);
  };

  const StarRating = ({
    rating,
    onRatingChange,
    readonly = false,
  }: {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
  }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onRatingChange && onRatingChange(star)}
            className={`text-2xl ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-500">
        Memuat data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="px-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Kriteria Penilaian
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Berikan penilaian Bapak/Ibu dengan ketentuan sebagai berikut:
        </p>
        <p className="text-sm text-gray-600 mb-4">
          5: Sangat Baik <br />
          3: Cukup Baik <br />
          2: Kurang Baik <br />
          1: Sangat Tidak Baik <br />
        </p>
      </div>

      {/* Filters and Search */}
      <div className="px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama, Sobat ID, kecamatan, atau desa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="highest">Rating Tertinggi</option>
              <option value="lowest">Rating Terendah</option>
              <option value="name">Nama A-Z</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center px-4 py-2 text-sm text-white bg-brand-600 rounded-md hover:bg-brand-700 transition-colors">
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
        </div>

      {/* Table with Handsontable */}
        <div className="pt-4">
          <Hottable
            data={currentData.map((mitra) => [
              mitra.nama,
              mitra.sobatId,
              mitra.kecamatan,
              mitra.desa,
              mitra.rating,
              // Kolom Aksi akan di-render secara khusus
            ])}
            colHeaders={[
              "Nama Mitra",
              "Sobat ID",
              "Kecamatan",
              "Desa",
              "Rating",
              "Aksi",
            ]}
            columns={[
              { data: 0, readOnly: true },
              { data: 1, readOnly: true },
              { data: 2, readOnly: true },
              { data: 3, readOnly: true },
              { data: 4, readOnly: true },
              {
                // Kolom Aksi menggunakan custom renderer
                data: null,
                readOnly: true,
                renderer: (instance, td, row, col, prop, value, cellProperties) => {
                  td.innerHTML = `<div class="flex items-center justify-center space-x-2">
                                    <button class="text-blue-500 hover:text-blue-700" onclick="window.handleEvaluateClick(${row})">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                    </button>
                                  </div>`;
                },
              },
            ]}
            width="100%"
            height={400}
            manualRowResize={true}
            manualColumnResize={true}
            contextMenu={true}
            filters={true}
            dropdownMenu={true}
            className="evaluasi-mitra-table"
          />
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

      {/* Evaluation Modal */}
      {showEvaluationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Evaluasi Mitra: {selectedMitra?.nama}
                </h2>
                <button
                  onClick={() => setShowEvaluationForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Kriteria Evaluasi */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Kriteria Penilaian
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kualitas Data
                      </label>
                      <StarRating
                        rating={evaluationForm.kualitas_data}
                        onRatingChange={(rating) =>
                          setEvaluationForm((prev) => ({ ...prev, kualitas_data: rating }))
                        }
                      />
                    </div>
                    {/* ... (kriteria lainnya sama seperti sebelumnya) ... */}
                  </div>
                </div>

                {/* Keterangan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keterangan/Catatan
                  </label>
                  <textarea
                    value={evaluationForm.keterangan}
                    onChange={(e) =>
                      setEvaluationForm((prev) => ({ ...prev, keterangan: e.target.value }))
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Berikan catatan atau keterangan tambahan..."
                  />
                </div>

                {/* Evaluator */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Evaluator
                  </label>
                  <input
                    type="text"
                    value={evaluationForm.evaluator}
                    onChange={(e) =>
                      setEvaluationForm((prev) => ({ ...prev, evaluator: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Masukkan nama evaluator"
                  />
                </div>

                {/* Rating Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Ringkasan Penilaian
                  </h4>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      Rating Rata-rata:
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-lg font-bold text-gray-900">
                        {(
                          (evaluationForm.kualitas_data +
                            evaluationForm.ketepatan_waktu +
                            evaluationForm.komunikasi +
                            evaluationForm.profesionalisme) /
                          4
                        ).toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">/5.0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowEvaluationForm(false)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={submitEvaluation}
                  className="flex items-center px-4 py-2 text-sm text-white bg-brand-600 rounded-md hover:bg-brand-700"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Simpan Evaluasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}