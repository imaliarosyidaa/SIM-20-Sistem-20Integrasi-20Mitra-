import React, { useState } from "react";
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
import Hottable from '@components/ui/Hottable';

// Mock data untuk evaluasi mitra
const evaluasiData = [
  {
    id: 1,
    nama: "Ahmad Subaki",
    kecamatan: "Praya",
    desa: "Praya Timur",
    kegiatan_terakhir: "Sensus Penduduk 2024",
    tanggal_evaluasi: "2024-01-15",
    rating: 4.8,
    kualitas_data: 5,
    ketepatan_waktu: 5,
    komunikasi: 4,
    profesionalisme: 5,
    keterangan: "Mitra sangat baik, selalu tepat waktu dan data akurat",
    evaluator: "Dr. Siti Aminah",
  },
  {
    id: 2,
    nama: "Siti Rahmawati",
    kecamatan: "Praya",
    desa: "Praya Barat",
    kegiatan_terakhir: "Survei Ekonomi 2024",
    tanggal_evaluasi: "2024-01-20",
    rating: 4.7,
    kualitas_data: 5,
    ketepatan_waktu: 4,
    komunikasi: 5,
    profesionalisme: 5,
    keterangan: "Mitra dengan kinerja sangat baik dan komunikasi efektif",
    evaluator: "Drs. Ahmad Fauzi",
  },
  {
    id: 3,
    nama: "Muhammad Iqbal",
    kecamatan: "Praya Timur",
    desa: "Kelayu",
    kegiatan_terakhir: "Pendataan Harga 2024",
    tanggal_evaluasi: "2024-01-25",
    rating: 4.9,
    kualitas_data: 5,
    ketepatan_waktu: 5,
    komunikasi: 5,
    profesionalisme: 4,
    keterangan: "Mitra terbaik dengan kualitas kerja sangat memuaskan",
    evaluator: "Ir. Bayu Santoso",
  },
  {
    id: 4,
    nama: "Dewi Sartika",
    kecamatan: "Praya Barat",
    desa: "Mantang",
    kegiatan_terakhir: "Survei Pertanian 2024",
    tanggal_evaluasi: "2024-02-01",
    rating: 4.6,
    kualitas_data: 4,
    ketepatan_waktu: 5,
    komunikasi: 4,
    profesionalisme: 5,
    keterangan: "Kinerja baik dengan dedikasi tinggi",
    evaluator: "Dr. Siti Aminah",
  },
  {
    id: 5,
    nama: "Bayu Setiawan",
    kecamatan: "Pujut",
    desa: "Kuta",
    kegiatan_terakhir: "Sensus Ekonomi 2024",
    tanggal_evaluasi: "2024-02-05",
    rating: 4.5,
    kualitas_data: 4,
    ketepatan_waktu: 4,
    komunikasi: 5,
    profesionalisme: 5,
    keterangan: "Mitra dengan potensi besar, perlu sedikit perbaikan",
    evaluator: "Drs. Ahmad Fauzi",
  },
  {
    id: 6,
    nama: "Rina Marlina",
    kecamatan: "Jonggat",
    desa: "Penujak",
    kegiatan_terakhir: "Survei Upahan 2023",
    tanggal_evaluasi: "2024-02-10",
    rating: 3.2,
    kualitas_data: 3,
    ketepatan_waktu: 3,
    komunikasi: 4,
    profesionalisme: 3,
    keterangan: "Perlu peningkatan dalam ketepatan dan kualitas data",
    evaluator: "Ir. Bayu Santoso",
  },
  {
    id: 7,
    nama: "Andi Pratama",
    kecamatan: "Pujut",
    desa: "Sengkol",
    kegiatan_terakhir: "Pendataan IBS 2024",
    tanggal_evaluasi: "2024-02-15",
    rating: 4.3,
    kualitas_data: 4,
    ketepatan_waktu: 4,
    komunikasi: 4,
    profesionalisme: 5,
    keterangan: "Mitra dengan kinerja baik dan konsisten",
    evaluator: "Dr. Siti Aminah",
  },
  {
    id: 8,
    nama: "Lina Handayani",
    kecamatan: "Praya Timur",
    desa: "Bagik Payung",
    kegiatan_terakhir: "Survei Sosial 2024",
    tanggal_evaluasi: "2024-02-20",
    rating: 4.2,
    kualitas_data: 4,
    ketepatan_waktu: 4,
    komunikasi: 4,
    profesionalisme: 4,
    keterangan: "Kinerja stabil dengan hasil yang memuaskan",
    evaluator: "Drs. Ahmad Fauzi",
  },
];

const ratingCriteria = [
  {
    label: "Sangat Baik",
    value: 5,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  { label: "Baik", value: 4, color: "text-blue-600", bgColor: "bg-blue-100" },
  {
    label: "Cukup Baik",
    value: 3,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    label: "Kurang Baik",
    value: 2,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    label: "Sangat Tidak Baik",
    value: 1,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
];

export default function EvaluasiMitra() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"highest" | "lowest" | "name" | "date">(
    "highest",
  );
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [selectedMitra, setSelectedMitra] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Form state untuk evaluasi
  const [evaluationForm, setEvaluationForm] = useState({
    kualitas_data: 5,
    ketepatan_waktu: 5,
    komunikasi: 5,
    profesionalisme: 5,
    keterangan: "",
    evaluator: "",
  });

  // Filter dan sorting data
  const filteredData = evaluasiData
    .filter(
      (mitra) =>
        mitra.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mitra.kecamatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mitra.desa.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        case "name":
          return a.nama.localeCompare(b.nama);
        case "date":
          return (
            new Date(b.tanggal_evaluasi).getTime() -
            new Date(a.tanggal_evaluasi).getTime()
          );
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Statistics
  const avgRating = (
    filteredData.reduce((sum, item) => sum + item.rating, 0) /
    filteredData.length
  ).toFixed(1);
  const excellentCount = filteredData.filter((m) => m.rating >= 4.5).length;
  const goodCount = filteredData.filter(
    (m) => m.rating >= 4.0 && m.rating < 4.5,
  ).length;
  const needsImprovementCount = filteredData.filter(
    (m) => m.rating < 4.0,
  ).length;

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-blue-600";
    if (rating >= 3.0) return "text-yellow-600";
    if (rating >= 2.0) return "text-orange-600";
    return "text-red-600";
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return "Sangat Baik";
    if (rating >= 4.0) return "Baik";
    if (rating >= 3.0) return "Cukup Baik";
    if (rating >= 2.0) return "Kurang Baik";
    return "Sangat Tidak Baik";
  };

  const handleEvaluate = (mitra: any) => {
    setSelectedMitra(mitra);
    setEvaluationForm({
      kualitas_data: mitra.kualitas_data || 5,
      ketepatan_waktu: mitra.ketepatan_waktu || 5,
      komunikasi: mitra.komunikasi || 5,
      profesionalisme: mitra.profesionalisme || 5,
      keterangan: mitra.keterangan || "",
      evaluator: mitra.evaluator || "",
    });
    setShowEvaluationForm(true);
  };

  const submitEvaluation = () => {
    // Simulate API call
    console.log("Submitting evaluation:", evaluationForm);
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

  return (
    <div className="space-y-6">

      {/* Rating Criteria */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Kriteria Penilaian
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Berikan penilaian Bapak/Ibu dengan ketentuan sebagai berikut:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {ratingCriteria.map((criteria) => (
            <div
              key={criteria.value}
              className={`${criteria.bgColor} rounded-lg p-4 text-center`}
            >
              <div className={`text-2xl font-bold ${criteria.color}`}>
                {criteria.value}
              </div>
              <div className={`text-sm font-medium ${criteria.color}`}>
                {criteria.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rata-rata Rating</p>
              <p className="text-2xl font-bold text-blue-600">{avgRating}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sangat Baik</p>
              <p className="text-2xl font-bold text-green-600">
                {excellentCount}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Baik</p>
              <p className="text-2xl font-bold text-blue-600">{goodCount}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">OK</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Perlu Perbaikan</p>
              <p className="text-2xl font-bold text-orange-600">
                {needsImprovementCount}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama mitra, kecamatan, atau desa..."
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
              <option value="date">Terbaru</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center px-4 py-2 text-sm text-white bg-brand-600 rounded-md hover:bg-brand-700 transition-colors">
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table with Handsontable */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4">
          <Hottable
            data={currentData.map(mitra => [
              mitra.nama,
              `${mitra.kecamatan}, ${mitra.desa}`,
              mitra.kegiatan_terakhir,
              mitra.rating,
              getRatingLabel(mitra.rating),
              new Date(mitra.tanggal_evaluasi).toLocaleDateString("id-ID"),
              mitra.evaluator,
              mitra.kualitas_data,
              mitra.ketepatan_waktu,
              mitra.komunikasi,
              mitra.profesionalisme,
              mitra.keterangan
            ])}
            colHeaders={[
              'Nama Mitra',
              'Lokasi',
              'Kegiatan Terakhir',
              'Rating',
              'Kategori Rating',
              'Tanggal Evaluasi',
              'Evaluator',
              'Kualitas Data',
              'Ketepatan Waktu',
              'Komunikasi',
              'Profesionalisme',
              'Keterangan'
            ]}
            columns={[
              { data: 0, type: 'text', readOnly: true },
              { data: 1, type: 'text', readOnly: true },
              { data: 2, type: 'text', readOnly: true },
              { data: 3, type: 'numeric', readOnly: true, numericFormat: { pattern: '0.0' } },
              { data: 4, type: 'text', readOnly: true },
              { data: 5, type: 'text', readOnly: true },
              { data: 6, type: 'text', readOnly: true },
              { data: 7, type: 'numeric', readOnly: true },
              { data: 8, type: 'numeric', readOnly: true },
              { data: 9, type: 'numeric', readOnly: true },
              { data: 10, type: 'numeric', readOnly: true },
              { data: 11, type: 'text', readOnly: true }
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
                  {selectedMitra
                    ? `Evaluasi ${selectedMitra.nama}`
                    : "Evaluasi Baru"}
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
                          setEvaluationForm({
                            ...evaluationForm,
                            kualitas_data: rating,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ketepatan Waktu
                      </label>
                      <StarRating
                        rating={evaluationForm.ketepatan_waktu}
                        onRatingChange={(rating) =>
                          setEvaluationForm({
                            ...evaluationForm,
                            ketepatan_waktu: rating,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Komunikasi
                      </label>
                      <StarRating
                        rating={evaluationForm.komunikasi}
                        onRatingChange={(rating) =>
                          setEvaluationForm({
                            ...evaluationForm,
                            komunikasi: rating,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profesionalisme
                      </label>
                      <StarRating
                        rating={evaluationForm.profesionalisme}
                        onRatingChange={(rating) =>
                          setEvaluationForm({
                            ...evaluationForm,
                            profesionalisme: rating,
                          })
                        }
                      />
                    </div>
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
                      setEvaluationForm({
                        ...evaluationForm,
                        keterangan: e.target.value,
                      })
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
                      setEvaluationForm({
                        ...evaluationForm,
                        evaluator: e.target.value,
                      })
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
