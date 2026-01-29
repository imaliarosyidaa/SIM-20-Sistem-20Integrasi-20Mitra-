import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import Table from "@components/table"
import honorApi from "@/lib/honorApi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import KegiatanMitraTable from "./tabel-kegiatan-mitra";
import { months } from '../../constants'
import useAuth from "@/hooks/use-auth";
import useHonorApi from "@/lib/honorApi";
import useKegiatanMitraApi from "@/lib/kegaiatanMitraApi";
import filterApi from "@/lib/filterApi";

export default function RekapHonor() {
  const [activeTab, setActiveTab] = useState<"rekap" | "rincian">("rincian");
  const [detailHonorData, setDetailHonorData] = useState<any[]>([]);
  const [rekapHonorPerBulan, setRekapHonorPerBulan] = useState([]);

  const currentYear = new Date().getFullYear();
  const [years, setYears] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { getTahun } = filterApi();

  const batasHonor = 3226000;
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();
  const [error, setError] = useState(false);
  const { getRekapHonorPerBulan, getRincianHonor } = useHonorApi()
  const { getKegiatanById, getJumlahKegiatanMitra } = useKegiatanMitraApi()
  const [expandedSection, setExpandedSection] = useState(false)
  const [rincianTable, setRincianTable] = useState([])
  const [dataMitra, setDataMitra] = useState()
  const [month, setMonth] = useState("")
  const [totalHonor, setTotalHonor] = useState(0);

  async function fetchTahun() {
    getTahun().then((res) => {
      setYears(res);
    })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }

  const getCellClassName = (cell) => {
    if ((cell.column.id == 'januari' || cell.column.id == 'februari' || cell.column.id == 'maret' ||
      cell.column.id == 'april' || cell.column.id == 'mei' || cell.column.id == 'juni' ||
      cell.column.id == 'juli' || cell.column.id == 'agustus' || cell.column.id == 'september' || cell.column.id == 'oktober'
      || cell.column.id == 'november' || cell.column.id == 'desember'
    ) && cell.value > batasHonor) {
      return {
        className: 'px-3 bg-red-500 hover:bg-red-600 transition-colors duration-100 cursor-pointer',
      };
    }
    return {
      className: 'truncate text-black font-normal hover:bg-gray-100 transition-colors duration-100 cursor-pointer',
    };
  };

  const getKegiatanByIdData = async (id, month, year) => {
    getKegiatanById(id, month, year).then((res) => {
      setRincianTable(res.KegiatanMitra);
      let total = 0;
      res.KegiatanMitra.forEach(item => {
        total += Number(item.jumlah);
      });

      setTotalHonor(total);
    })
      .catch((err) => {
        console.error("Failed to fetch kegiatan data:", err);
        setRincianTable([]);
      })
      .finally(() => {
        setIsLoading(false)
      })
  };

  function showRincian(data, year, month) {
    getKegiatanByIdData(data.id, year, month)
    setDataMitra(data)
    setMonth(month)
    if (data) {
      setExpandedSection(true)
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });
    }
  }

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
    {
      Header: "Jan", accessor: "januari",
      onCellClick: (value, row) => {
        showRincian(row.original, 2025, "Januari");
      },
      Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'januari'
    },
    {
      Header: "Feb", accessor: "februari",
      onCellClick: (value, row) => {
        showRincian(row.original, 2025, "Februari");
      },
      Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'februari'
    },
    {
      Header: "Mar", accessor: "maret",
      onCellClick: (value, row) => {
        showRincian(row.original, 2025, "Maret");
      },
      Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'maret'
    },
    {
      Header: "Apr", accessor: "april",
      onCellClick: (value, row) => {
        showRincian(row.original, 2025, "April");
      },
      Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'april'
    },
    {
      Header: "Mei", accessor: "mei",
      onCellClick: (value, row) => {
        showRincian(row.original, 2025, "Mei");
      },
      Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'mei'
    },
    {
      Header: "Jun", accessor: "juni",
      onCellClick: (value, row) => {
        showRincian(row.original, 2025, "Juni");
      },
      Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'juni'
    },
    {
      Header: "Jul", accessor: "juli", onCellClick: (value, row) => {
        showRincian(row.original, 2025, "Juli");
      },
      Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'juli'
    },
    {
      Header: "Agus", accessor: "agustus", onCellClick: (value, row) => {
        showRincian(row.original, 2025, "Agustus");
      },
      Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'agustus'
    },
    {
      Header: "Sept", accessor: "september", onCellClick: (value, row) => {
        showRincian(row.original, 2025, "September");
      },
      Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'september'
    },
    {
      Header: "Okt", accessor: "oktober", onCellClick: (value, row) => {
        showRincian(row.original, 2025, "Oktober");
      },
      Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'oktober'
    },
    {
      Header: "Nov", accessor: "november", onCellClick: (value, row) => {
        showRincian(row.original, 2025, "November");
      },
      Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'november'
    },
    {
      Header: "Des", accessor: "desember", onCellClick: (value, row) => {
        showRincian(row.original, 2025, "Desember");
      },
      Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'desember'
    },
    { Header: "Total", accessor: "total", Cell: ({ value }) => { return new Intl.NumberFormat("id-ID").format(value) }, id: 'total' },
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

  const getRincianHonorData = useCallback(async (selectedYear) => {
    setIsLoading(true);

    getRincianHonor(selectedYear).then((res) => {
      setDetailHonorData(res);
    })
      .catch((err) => {
        setError(true)
        setDetailHonorData([]);
      })
      .finally(() => { setIsLoading(false); setExpandedSection(false) })
  }, []);

  useEffect(() => {
    if (activeTab === "rincian") {
      getRincianHonorData(selectedYear);
      fetchTahun()
    } else {
      getRekapHonorPerBulanData(selectedYear);
      setExpandedSection(false)
      fetchTahun()
    }
  }, [activeTab, selectedYear, getRincianHonorData]);

  const submenuTabs = (
    <nav className="flex space-x-8 px-4 lg:px-6">
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

  function toRupiah(nominal: any) {
    const num = Number(nominal);

    if (isNaN(num)) return "Rp0";


    if (num > 1_000_000_000) {
      return "Rp" + (num / 1_000_000_000).toFixed(1) + "Miliyar";
    } else {
      return num.toLocaleString("id-ID");
    }
  }
  return (
    <>
      <div className="space-y-6 p-6">
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
                        <option key={year.year} value={year.year}>
                          {year.year}
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
                              className="flex-none h-28 w-56 min-w-[12rem] bg-purple-100 p-4 rounded-lg border-2 border-purple-400"
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
              <div className="justify-end flex mb-2">
                <select
                  id="tahun"
                  value={selectedYear}
                  onChange={(e) => {
                    const year = Number(e.target.value);
                    setSelectedYear(year);
                    getRincianHonorData(year);
                  }}
                  className="border rounded px-3 py-2"
                >
                  {years.map((year) => (
                    <option key={year.year} value={year.year}>
                      {year.year}
                    </option>
                  ))}
                </select>
              </div>
              <Table columns={columns} data={detailHonorData} getCellProps={getCellClassName} isLoading={isLoading} />
              {expandedSection && (
                <div className="col">
                  <h4 className="mb-3">Rincian Kegiatan Mitra <span className="bg-blue py-1 px-2 rounded">{dataMitra?.namaLengkap}</span> bulan <span className="bg-blue py-1 px-2 rounded">{month}</span> </h4>
                  <div className="mt-2 mb-4">
                    <div className="shadow-md sm:rounded-lg bg-white rounded-md block">
                      <table className="text-sm w-full text-sm text-left dark:text-gray-400">
                        <thead className="text-normal uppercase bg-[#FA4F58] text-black dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                          <tr>
                            <th scope="col" className="px-4 py-3">No.</th>
                            <th scope="col" className="px-4 py-3">Kegiatan</th>
                            <th scope="col" className="px-2 py-3">Tim</th>
                            <th scope="col" className="px-2 py-3">Volume</th>
                            <th scope="col" className="px-2 py-3">Satuan</th>
                            <th scope="col" className="px-2 py-3">Harga Per Satuan</th>
                            <th scope="col" className="px-4 py-3">Honor</th>
                          </tr>
                        </thead>
                        <tbody className="overflow-y-auto">
                          {isLoading ? (
                            <>
                              {[...Array(10)].map((_, i) => (
                                <tr key={i} className="animate-pulse text-xs">
                                  <td className="px-2 py-1">
                                    <div className="h-3 bg-gray-200 rounded w-4"></div>
                                  </td>
                                  <td className="px-2 py-1">
                                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                                  </td>
                                  <td className="px-2 py-1">
                                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                                  </td>
                                  <td className="px-2 py-1">
                                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                                  </td>
                                </tr>
                              ))}
                            </>
                          ) : rincianTable?.length > 0 ? (
                            <>
                              {rincianTable?.map((kegmitra, index) => (
                                <tr key={index} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                                  <td className="px-4 py-2 text-normal font-medium">{index + 1}.</td>
                                  <td className="px-4 py-2 text-normal font-medium">{kegmitra.nama_survei_sobat}</td>
                                  <td className="px-2 py-2 text-normal font-medium">{kegmitra.tim}</td>
                                  <td className="px-2 py-2 text-normal font-medium">{kegmitra.volum}</td>
                                  <td className="px-2 py-2 text-normal font-medium">{kegmitra.satuan}</td>
                                  <td className="px-2 py-2 text-normal font-medium">{toRupiah(kegmitra.harga_per_satuan)}</td>
                                  <td className="px-4 py-2 text-normal font-medium">{toRupiah(kegmitra.jumlah)}</td>
                                </tr>
                              ))}

                              <tr className="font-bold">
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className="px-2 py-2">
                                  TOTAL
                                </td>
                                <td className="px-4 py-2 text-normal">
                                  {toRupiah(totalHonor)}
                                </td>
                              </tr>
                            </>
                          ) : (
                            <tr>
                              <td colSpan={7} className="text-center text-xs px-4 py-4 text-xs">
                                Tidak ada data yang ditemukan.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
