import React, { useState } from "react";
import {
  Filter,
  RotateCcw,
  Download,
  Search,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import Hottable from '@components/ui/Hottable';

// Mock data untuk rincian honor mitra
const detailHonorData = [
  {
    no: 1,
    nama: "A390.Lalu Teja Joko Pranata Alam_Pujut",
    jan: 2827500,
    feb: 2912500,
    mar: 2922500,
    apr: 1787500,
    mei: 4589500,
    jun: 3267500,
    jul: 1117500,
    aug: 2272500,
    sep: 2035500,
    okt: 2247500,
    nov: 2840000,
    des: 2380500,
    total: 30800500,
  },
  {
    no: 2,
    nama: "A815.M.Dahlan_Praya",
    jan: 2411000,
    feb: 2018500,
    mar: 1786000,
    apr: 1800000,
    mei: 4528000,
    jun: 1570000,
    jul: 2085000,
    aug: 2893000,
    sep: 2468000,
    okt: 950000,
    nov: 1792000,
    des: 2864000,
    total: 30514000,
  },
  {
    no: 3,
    nama: "A547.Lalu Arya Yogi Pratama_Pujut",
    jan: 2691000,
    feb: 1414000,
    mar: 2036000,
    apr: 2344500,
    mei: 2447000,
    jun: 5099000,
    jul: 901000,
    aug: 2426000,
    sep: 2440000,
    okt: 2666000,
    nov: 2445000,
    des: 2391500,
    total: 29782500,
  },
  {
    no: 4,
    nama: "A547.Lalu Arya Yogi Pratama_Pujut",
    jan: 1734000,
    feb: 2315000,
    mar: 2530000,
    apr: 2208000,
    mei: 2169000,
    jun: 2524000,
    jul: 1325000,
    aug: 2330000,
    sep: 2449000,
    okt: 95,
    nov: 2206000,
    des: 2286000,
    total: 26367500,
  },
  {
    no: 5,
    nama: "A74.Ahmad Malna Haldi_Pujut",
    jan: 2753000,
    feb: 2920000,
    mar: 2716000,
    apr: 1645500,
    mei: 1435000,
    jun: 1931000,
    jul: 1950000,
    aug: 2965000,
    sep: 1680000,
    okt: 896000,
    nov: 1680000,
    des: 1680000,
    total: 25354000,
  },
];

// Mock data untuk rekap honor bulanan
const monthlyHonorData = [
  { month: "Januari", amount: 111824500 },
  { month: "Februari", amount: 332698500 },
  { month: "Maret", amount: 162068408 },
  { month: "April", amount: 101595500 },
  { month: "Mei", amount: 123027500 },
  { month: "Juni", amount: 250284500 },
  { month: "Juli", amount: 230986500 },
  { month: "Agustus", amount: 880162000 },
  { month: "September", amount: 126794500 },
  { month: "Oktober", amount: 66312000 },
  { month: "November", amount: 121144500 },
  { month: "Desember", amount: 90140000 },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID").format(amount);
};

export default function RekapHonor() {
  const [activeTab, setActiveTab] = useState<"rekap" | "rincian">("rekap");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedId, setSelectedId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const resetFilters = () => {
    setSelectedYear("2024");
    setSelectedId("");
    setSearchQuery("");
  };

  const totalAmount = monthlyHonorData.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  const filteredDetailData = detailHonorData.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
    <div className="border-b border-gray-200 bg-white">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("rekap")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "rekap"
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Rekap Honor
            </button>
            <button
              onClick={() => setActiveTab("rincian")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "rincian"
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Rincian Honor Mitra
            </button>
          </nav>
        </div>
    <div className="space-y-6">

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Tab Content */}
        <div className="p-6">
          {/* Filters Section */}
          <div className="mb-6">
            {activeTab === "rekap" && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Berdasarkan Peraturan Kepala Badan Pusat Statistik Nomor 15
                  Tahun 2024 Tentang Standar Biaya Kegiatan Statistik,
                  Honorarium Petugas Survei dengan Status Non PNS :
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>1. Petugas Pendataan Lapangan (Surveyor) : Rp 316,000</p>
                  <p>2. Petugas pemeriksaan Lapangan (Surveyor) : Rp 316,000</p>
                  <p>3. Petugas Pengolahan (Surveyor) : Rp 2,882,000</p>
                  <p>
                    4. Petugas Pemeriksaan Lapangan (Supervisor) : Rp 4,756,000
                  </p>
                  <p>
                    5. Petugas pemeriksaan Lapangan (Surveyor) : Rp 4,830,000
                  </p>
                  <p>
                    6. Petugas Pengolahan dan Pengawas Pengolahan (Surveyor) :
                    Rp 5,194,000
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Tahun</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>

                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Id_nama</option>
                  <option value="a390">A390</option>
                  <option value="a815">A815</option>
                  <option value="a547">A547</option>
                  <option value="a74">A74</option>
                </select>

                {activeTab === "rincian" && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari nama mitra..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetFilters}
                  className="flex items-center px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset Filter
                </button>
                <button className="flex items-center px-4 py-2 text-sm text-white bg-brand-600 rounded-md hover:bg-brand-700 transition-colors">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === "rekap" && (
            <div className="space-y-6">
              {/* Monthly Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {monthlyHonorData.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border rounded-lg overflow-hidden shadow-sm"
                  >
                    <div className="bg-gray-100 px-4 py-3 border-b">
                      <h3 className="font-medium text-gray-900 text-center">
                        {item.month}
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="bg-blue-500 text-white text-center py-3 px-4 rounded-md">
                        <div className="text-lg font-bold">
                          {formatCurrency(item.amount)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-100 px-4 py-3 border-b">
                  <h3 className="font-medium text-gray-900 text-center">
                    Tahunan
                  </h3>
                </div>
                <div className="p-4">
                  <div className="bg-green-500 text-white text-center py-4 px-4 rounded-md">
                    <div className="text-2xl font-bold">
                      {formatCurrency(totalAmount)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "rincian" && (
            <div className="overflow-x-auto">
              <Hottable
                data={filteredDetailData.map(row => [
                  row.no,
                  row.nama,
                  row.jan,
                  row.feb,
                  row.mar,
                  row.apr,
                  row.mei,
                  row.jun,
                  row.jul,
                  row.aug,
                  row.sep,
                  row.okt,
                  row.nov,
                  row.des,
                  row.total
                ])}
                colHeaders={[
                  'No',
                  'Nama',
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'Mei',
                  'Jun',
                  'Jul',
                  'Ags',
                  'Sep',
                  'Okt',
                  'Nov',
                  'Des',
                  'Total'
                ]}
                columns={[
                  { data: 0, readOnly: true },
                  { data: 1, readOnly: true, width: 250 },
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
                  { data: 12, readOnly: true },
                  { data: 13, readOnly: true },
                  { data: 14, readOnly: true }
                ]}
                width="100%"
                height={400}
                manualRowResize={true}
                manualColumnResize={true}
                contextMenu={true}
                filters={true}
                dropdownMenu={true}
                className="rekap-honor-table"
              />

              {/* Pagination Info */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>
                  Menampilkan {filteredDetailData.length} dari{" "}
                  {detailHonorData.length} data
                </span>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
                    Sebelumnya
                  </button>
                  <span className="px-3 py-1 bg-brand-600 text-white rounded">
                    1
                  </span>
                  <button className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
