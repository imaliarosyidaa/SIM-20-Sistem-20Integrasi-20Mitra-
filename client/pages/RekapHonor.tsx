import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  RotateCcw,
  Download,
  Search,
} from "lucide-react";
import Hottable from "@components/ui/Hottable";
import Layout from "@components/Layout";
import axios from '../lib/api'
import Table from "@components/table"

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
  const [selectedId, setSelectedId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [detailHonorData, setDetailHonorData] = useState<any[]>([]);
  const [rekapHonorPerBulan, setRekapHonorPerBulan] = useState([]);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const getRekapHonorPerBulan = useCallback(async (selectedYear) => {
    try {
      const res = await axios.get(`/honormitra/rekap/${selectedYear}`);
      setRekapHonorPerBulan(res.data.data)
    } catch (err) {
      console.error("gagal mengambil data", err)
    }
  }, [])

  const getRincianHonor = useCallback(async () => {
    try {
      const res = await axios.get('/honormitra');
      if (Array.isArray(res.data.data)) {
        const dataWithTotal = res.data.data.map((row) => ({
          ...row,
          totalHonor:
            (row.januari || 0) +
            (row.februari || 0) +
            (row.maret || 0) +
            (row.april || 0) +
            (row.mei || 0) +
            (row.juni || 0) +
            (row.juli || 0) +
            (row.agustus || 0) +
            (row.september || 0) +
            (row.oktober || 0) +
            (row.november || 0) +
            (row.desember || 0),
        }));
        setDetailHonorData(dataWithTotal);
      } else {
        setDetailHonorData([]);
      }
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setDetailHonorData([]);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "rekap") {
      getRekapHonorPerBulan(selectedYear);
    } else {
      getRincianHonor();
    }
  }, [activeTab, selectedYear, getRincianHonor]);

  const submenuTabs = (
    <nav className="flex space-x-8 px-4 lg:px-6">
      <button
        onClick={() => setActiveTab("rekap")}
        className={`py-4 flex gap-2 items-center px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "rekap"
          ? "border-brand-500 text-brand-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-check-fill" viewBox="0 0 16 16">
          <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2m-5.146-5.146-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708" />
        </svg>
        Rekap Honor
      </button>
      <button
        onClick={() => setActiveTab("rincian")}
        className={`py-4 flex items-center gap-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "rincian"
          ? "border-brand-500 text-brand-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-spreadsheet-fill" viewBox="0 0 16 16">
          <path d="M6 12v-2h3v2z" />
          <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M3 9h10v1h-3v2h3v1h-3v2H9v-2H6v2H5v-2H3v-1h2v-2H3z" />
        </svg>
        Rincian Honor Mitra
      </button>
    </nav>
  );

  return (
    <Layout submenu={submenuTabs}>
      <div>
        <div>
          <div>
            {activeTab === "rekap" && (
              <div className="flex min-h-screen">
                {/* Konten Utama */}
                <main className="flex-1 overflow-y-auto pr-8">
                  {/* Months Section */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800">Bulan</h3>
                      <select
                        id="tahun"
                        value={selectedYear}
                        onChange={(e) => {
                          const year = Number(e.target.value);
                          setSelectedYear(year);
                          getRekapHonorPerBulan(year);
                        }}
                        className="border rounded px-3 py-2"
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Card Bulan */}
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div className="bg-purple-100 p-5 rounded-lg border-2 border-purple-400">
                          <h4 className="font-bold text-purple-700 mb-2">{rekapHonorPerBulan[i]?.bulan}</h4>
                          <div className="flex items-center text-xl font-semibold text-purple-500 bg-white px-2 rounded-lg">
                            Rp {(rekapHonorPerBulan[i]?.total || 0).toLocaleString("id-ID")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lessons Section */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800">Lessons</h3>
                      <a href="#" className="text-sm text-blue-600">View All &gt;</a>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="text-left py-2 text-sm text-gray-500">Class</th>
                            <th className="text-left py-2 text-sm text-gray-500">Teacher Name</th>
                            <th className="text-left py-2 text-sm text-gray-500">Members</th>
                            <th className="text-left py-2 text-sm text-gray-500">Starting</th>
                            <th className="text-left py-2 text-sm text-gray-500">Material</th>
                            <th className="text-left py-2 text-sm text-gray-500">Payment</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b last:border-0">
                            <td className="py-3 text-sm font-medium text-gray-800">A1</td>
                            <td className="py-3 text-sm text-gray-600">Bernard Carr</td>
                            <td className="py-3 text-sm text-gray-600">3+</td>
                            <td className="py-3 text-sm text-gray-600">12.07.2022</td>
                            <td className="py-3 text-sm text-blue-600"><a href="#">Download</a></td>
                            <td className="py-3 text-sm text-green-600">Done</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </main>

                {/* Sidebar Kanan */}
                <aside className="w-80 bg-white p-6 shadow-md rounded-l-lg overflow-y-auto">
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-gray-200 mb-2"></div>
                    <h3 className="text-lg font-bold text-gray-800">Stella Walton</h3>
                    <span className="text-sm text-gray-500">Student</span>
                    <button className="mt-2 px-6 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">Profile</button>
                  </div>

                  {/* Kalender */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-gray-800">December 2022</h4>
                      {/* Navigasi kalender */}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <span key={day} className="text-gray-500">{day}</span>
                      ))}
                      {/* Contoh tanggal */}
                      <span className="py-1">28</span>
                      <span className="py-1">29</span>
                      <span className="py-1">30</span>
                      <span className="py-1">1</span>
                      <span className="py-1">2</span>
                      <span className="py-1">3</span>
                      {/* Lanjutkan dengan tanggal lainnya */}
                    </div>
                  </div>

                  {/* Reminders */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Reminders</h4>
                    <ul className="space-y-3">
                      <li className="p-3 bg-gray-50 rounded-lg flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                        <div>
                          <p className="text-sm font-medium">Eng - Vocabulary test</p>
                          <span className="text-xs text-gray-500">21 Dec 2022, Friday</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </aside>
              </div>
            )}

            {activeTab === "rincian" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Mitra</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Januari</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Februari</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maret</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">April</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mei</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Juni</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Juli</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agustus</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">September</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oktober</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">November</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Desember</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Honor</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {detailHonorData.map((item, index) => (
                      <tr key={index} >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.sobatId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.januari}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.februari}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.maret}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.april}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.mei}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.juni}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.juli}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.agustus}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.september}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.oktober}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.november}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.desember}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.totalHonor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
