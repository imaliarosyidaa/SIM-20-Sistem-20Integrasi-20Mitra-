import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import Table from "@components/table"
import honorApi from "@/lib/honorApi";
import './carausel.css'
import { ChevronLeft, ChevronRight } from "lucide-react";
import KegiatanMitraTable from "./KegiatanMitraTable";
import { months } from '../constants'
import useAuth from "@/hooks/use-auth";
import useHonorApi from "@/lib/honorApi";

export default function RekapHonor() {
  const [activeTab, setActiveTab] = useState<"rekap" | "rincian">("rekap");
  const [detailHonorData, setDetailHonorData] = useState<any[]>([]);
  const [rekapHonorPerBulan, setRekapHonorPerBulan] = useState([]);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const batasHonor = 3226000;
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();
  const [error, setError] = useState(false);
  const { getRekapHonorPerBulan, getRincianHonor } = useHonorApi()

  const getCellClassName = (cell) => {
    if ((cell.column.id == 'januari' || cell.column.id == 'februari' || cell.column.id == 'maret' ||
      cell.column.id == 'april' || cell.column.id == 'mei' || cell.column.id == 'juni' ||
      cell.column.id == 'juli' || cell.column.id == 'agustus' || cell.column.id == 'september' || cell.column.id == 'oktober'
      || cell.column.id == 'november' || cell.column.id == 'desember'
    ) && cell.value > batasHonor) {
      return {
        className: 'px-3 bg-red-200',
      };
    }
    return {
      className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
    };
  };

  const columns = [
    {
      Header: 'No.',
      Cell: ({ row, state }) => {
        const { pageSize, pageIndex } = state;
        const rowIndex = row.index;
        const globalIndex = pageIndex * pageSize + rowIndex + 1;
        return globalIndex;
      },
    },
    { Header: "Nama Mitra", accessor: "namaLengkap" },
    { Header: "Januari", accessor: "januari", Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'januari' },
    { Header: "Februari", accessor: "februari", Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'februari' },
    { Header: "Maret", accessor: "maret", Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'maret' },
    { Header: "April", accessor: "april", Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'april' },
    { Header: "Mei", accessor: "mei", Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'mei' },
    { Header: "Juni", accessor: "juni", Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'juni' },
    { Header: "Juli", accessor: "juli", Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'juli' },
    { Header: "Agustus", accessor: "agustus", Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'agustus' },
    { Header: "September", accessor: "september", Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'september' },
    { Header: "Oktober", accessor: "oktober", Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'oktober' },
    { Header: "November", accessor: "november", Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'november' },
    { Header: "Desember", accessor: "desember", Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'desember' },
    { Header: "Total", accessor: "total", Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, },
  ];

  const getRekapHonorPerBulanData = useCallback(async (selectedYear) => {
    setIsLoading(true);

    getRekapHonorPerBulan(selectedYear).then((res) => {
      setRekapHonorPerBulan(res);
    }).catch((err) => {
      console.error("gagal mengambil data", err);
    })
      .finally(() => { setIsLoading(false) })
  }, []);

  const getRincianHonorData = useCallback(async () => {
    setIsLoading(true);

    getRincianHonor().then((res) => {
      setDetailHonorData(res);
    })
      .catch((err) => {
        setError(true)
        setDetailHonorData([]);
      })
      .finally(() => { setIsLoading(false) })
  }, []);

  useEffect(() => {
    if (activeTab === "rekap") {
      getRekapHonorPerBulanData(selectedYear);
    } else {
      getRincianHonorData();
    }
  }, [activeTab, selectedYear, getRincianHonorData]);

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
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft;
      const cardWidth = carouselRef.current.offsetWidth;
      const index = Math.round(scrollPosition / cardWidth);
      setActiveIndex(index);
    }
  };

  const handleArrowClick = (direction) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth;
      const newScrollPosition =
        direction === "left"
          ? carouselRef.current.scrollLeft - cardWidth
          : carouselRef.current.scrollLeft + cardWidth;

      carouselRef.current.scrollTo({ left: newScrollPosition, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (!carouselElement) return;

    carouselElement.addEventListener("scroll", handleScroll);

    return () => {
      carouselElement.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <div className="border-b bg-gray-100 border-gray-200 sticky top-14 z-10 mb-6">
        {submenuTabs}
      </div>
      <div>
        {activeTab === "rekap" && (
          <div className="flex min-h-screen">
            <main className="flex-1 overflow-y-auto">
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
                <div className="relative">
                  <div className="relative overflow-hidden">
                    {/* Tombol navigasi kiri */}
                    <button
                      onClick={() => handleArrowClick("left")}
                      className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg z-10 opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <div
                      ref={carouselRef}
                      className="flex space-x-6 overflow-x-auto p-4 scroll-smooth hide-scrollbar"
                    >
                      {months.map((month, i) => {
                        const monthData = rekapHonorPerBulan?.find(item => item.bulan === month);

                        return (
                          <div
                            key={i}
                            className="flex-none h-28 w-56 min-w-[12rem] bg-purple-100 p-5 rounded-lg border-2 border-purple-400"
                          >
                            <h4 className="font-bold text-purple-700 mb-2">{month}</h4>
                            <div className="flex items-center text-xl font-semibold text-purple-500 bg-white px-2 rounded-lg">
                              Rp {(monthData?.total || 0).toLocaleString("id-ID")}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Tombol navigasi kanan */}
                    <button
                      onClick={() => handleArrowClick("right")}
                      className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg z-10 opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                  <div className="flex justify-center mt-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (carouselRef.current) {
                            const cardWidth = carouselRef.current.offsetWidth;
                            carouselRef.current.scrollTo({ left: cardWidth * i, behavior: "smooth" });
                            setActiveIndex(i);
                          }
                        }}
                        className={`w-3 h-3 mx-1 rounded-full transition-colors duration-300 ${i === activeIndex % 5 ? "bg-purple-700" : "bg-gray-400"
                          }`}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
              <KegiatanMitraTable />
            </main>
          </div>
        )}

        {activeTab === "rincian" && (
          <div className="flex-1">
            <Table columns={columns} data={detailHonorData} getCellProps={getCellClassName} isLoading={isLoading} />
          </div>
        )}
      </div>
    </>
  );
}
