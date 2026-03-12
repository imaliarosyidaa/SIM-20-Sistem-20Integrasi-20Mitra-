import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import html2pdf from "html2pdf.js";
import Table from "@components/table";
import honorApi from "@/lib/honorApi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import KegiatanMitraTable from "./tabel-kegiatan-mitra";
import { months } from "../../constants";
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
  const [selectedYear, setSelectedYear] = useState(
    Number(currentYear).toString(),
  );
  const { getTahun } = filterApi();

  const batasHonor = 3226000;
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();
  const [error, setError] = useState(false);
  const { getRekapHonorPerBulan, getRincianHonor } = useHonorApi();
  const { getKegiatanById, getJumlahKegiatanMitra } = useKegiatanMitraApi();
  const [expandedSection, setExpandedSection] = useState(false);
  const [rincianTable, setRincianTable] = useState([]);
  const [dataMitra, setDataMitra] = useState();
  const [month, setMonth] = useState("");
  const [totalHonor, setTotalHonor] = useState(0);

  async function fetchTahun() {
    getTahun()
      .then((res) => {
        setYears(res);
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }

  const getCellClassName = (cell) => {
    if (
      (cell.column.id == "januari" ||
        cell.column.id == "februari" ||
        cell.column.id == "maret" ||
        cell.column.id == "april" ||
        cell.column.id == "mei" ||
        cell.column.id == "juni" ||
        cell.column.id == "juli" ||
        cell.column.id == "agustus" ||
        cell.column.id == "september" ||
        cell.column.id == "oktober" ||
        cell.column.id == "november" ||
        cell.column.id == "desember") &&
      cell.value > batasHonor
    ) {
      return {
        className:
          "px-3 bg-red-500 hover:bg-red-600 transition-colors duration-100 cursor-pointer",
      };
    }
    return {
      className:
        "truncate text-gray-900 font-normal hover:bg-gray-50 transition-colors duration-100 cursor-pointer",
    };
  };

  const getKegiatanByIdData = async (id, month, year) => {
    getKegiatanById(id, month, year)
      .then((res) => {
        setRincianTable(res.KegiatanMitra);
        let total = 0;
        res.KegiatanMitra.forEach((item) => {
          total += Number(item.jumlah);
        });
        setTotalHonor(total);
      })
      .catch((err) => {
        console.error("Failed to fetch kegiatan data:", err);
        setRincianTable([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  function showRincian(data, year, month) {
    getKegiatanByIdData(data.id, year, month);
    setDataMitra(data);
    setMonth(month);
    if (data) {
      setExpandedSection(true);
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  const columns = [
    {
      Header: "No.",
      Cell: ({ row, state }) => {
        const { pageSize, pageIndex } = state;
        const rowIndex = row.index;
        const globalIndex = pageIndex * pageSize + rowIndex + 1;
        return globalIndex;
      },
    },
    { Header: "Nama Mitra", accessor: "namaLengkap" },
    {
      Header: "Jan",
      accessor: "januari",
      onCellClick: (value, row) => {
        showRincian(row.original, Number(selectedYear), "Januari");
      },
      Cell: ({ value }) => {
        return new Intl.NumberFormat("id-ID").format(value);
      },
      id: "januari",
    },
    {
      Header: "Feb",
      accessor: "februari",
      onCellClick: (value, row) => {
        showRincian(row.original, Number(selectedYear), "Februari");
      },
      Cell: ({ value }) => {
        return new Intl.NumberFormat("id-ID").format(value);
      },
      id: "februari",
    },
    {
      Header: "Mar",
      accessor: "maret",
      onCellClick: (value, row) => {
        showRincian(row.original, Number(selectedYear), "Maret");
      },
      Cell: ({ value }) => {
        return new Intl.NumberFormat("id-ID").format(value);
      },
      id: "maret",
    },
    {
      Header: "Apr",
      accessor: "april",
      onCellClick: (value, row) => {
        showRincian(row.original, Number(selectedYear), "April");
      },
      Cell: ({ value }) => {
        return new Intl.NumberFormat("id-ID").format(value);
      },
      id: "april",
    },
    {
      Header: "Mei",
      accessor: "mei",
      onCellClick: (value, row) => {
        showRincian(row.original, Number(selectedYear), "Mei");
      },
      Cell: ({ value }) => {
        return new Intl.NumberFormat("id-ID").format(value);
      },
      id: "mei",
    },
    {
      Header: "Jun",
      accessor: "juni",
      onCellClick: (value, row) => {
        showRincian(row.original, Number(selectedYear), "Juni");
      },
      Cell: ({ value }) => {
        return new Intl.NumberFormat("id-ID").format(value);
      },
      id: "juni",
    },
    {
      Header: "Jul",
      accessor: "juli",
      onCellClick: (value, row) => {
        showRincian(row.original, Number(selectedYear), "Juli");
      },
      Cell: ({ value }) => {
        return new Intl.NumberFormat("id-ID").format(value);
      },
      id: "juli",
    },
    {
      Header: "Agus",
      accessor: "agustus",
      onCellClick: (value, row) => {
        showRincian(row.original, Number(selectedYear), "Agustus");
      },
      Cell: ({ value }) => {
        return new Intl.NumberFormat("id-ID").format(value);
      },
      id: "agustus",
    },
    {
      Header: "Sept",
      accessor: "september",
      onCellClick: (value, row) => {
        showRincian(row.original, Number(selectedYear), "September");
      },
      Cell: ({ value }) => {
        return new Intl.NumberFormat("id-ID").format(value);
      },
      id: "september",
    },
    {
      Header: "Okt",
      accessor: "oktober",
      onCellClick: (value, row) => {
        showRincian(row.original, Number(selectedYear), "Oktober");
      },
      Cell: ({ value }) => {
        return new Intl.NumberFormat("id-ID").format(value);
      },
      id: "oktober",
    },
    {
      Header: "Nov",
      accessor: "november",
      onCellClick: (value, row) => {
        showRincian(row.original, Number(selectedYear), "November");
      },
      Cell: ({ value }) => {
        return new Intl.NumberFormat("id-ID").format(value);
      },
      id: "november",
    },
    {
      Header: "Des",
      accessor: "desember",
      onCellClick: (value, row) => {
        showRincian(row.original, Number(selectedYear), "Desember");
      },
      Cell: ({ value }) => {
        return new Intl.NumberFormat("id-ID").format(value);
      },
      id: "desember",
    },
    {
      Header: "Total",
      accessor: "total",
      Cell: ({ value }) => {
        return new Intl.NumberFormat("id-ID").format(value);
      },
      id: "total",
    },
  ];

  const getRekapHonorPerBulanData = useCallback(async (selectedYear) => {
    setIsLoading(true);

    getRekapHonorPerBulan(selectedYear)
      .then((res) => {
        setRekapHonorPerBulan(res);
      })
      .catch((err) => {
        console.error("gagal mengambil data", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const getRincianHonorData = useCallback(async (selectedYear) => {
    setIsLoading(true);

    getRincianHonor(selectedYear)
      .then((res) => {
        setDetailHonorData(res);
      })
      .catch((err) => {
        setError(true);
        setDetailHonorData([]);
      })
      .finally(() => {
        setIsLoading(false);
        setExpandedSection(false);
      });
  }, []);

  useEffect(() => {
    if (activeTab === "rincian") {
      getRincianHonorData(selectedYear);
      fetchTahun();
    } else {
      getRekapHonorPerBulanData(selectedYear);
      setExpandedSection(false);
      fetchTahun();
    }
  }, [activeTab, selectedYear, getRincianHonorData]);

  const submenuTabs = (
    <nav className="flex space-x-8 px-4 lg:px-6">
      <button
        onClick={() => setActiveTab("rincian")}
        className={`py-2 flex items-center gap-2 px-1 border-b-2 font-medium text-sm transition-colors ${
          activeTab === "rincian"
            ? "border-blue-600 text-blue-700"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-file-earmark-spreadsheet-fill"
          viewBox="0 0 16 16"
        >
          <path d="M6 12v-2h3v2z" />
          <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M3 9h10v1h-3v2h3v1h-3v2H9v-2H6v2H5v-2H3v-1h2v-2H3z" />
        </svg>
        Rincian Honor Mitra
      </button>
      <button
        onClick={() => setActiveTab("rekap")}
        className={`py-2 flex gap-2 items-center px-1 border-b-2 font-medium text-sm transition-colors ${
          activeTab === "rekap"
            ? "border-blue-600 text-blue-700"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-calendar-check-fill"
          viewBox="0 0 16 16"
        >
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

      carouselRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
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
  const handleExportSPK = () => {
    if (!rincianTable || rincianTable.length === 0) {
      alert("Tidak ada kegiatan untuk diexport");
      return;
    }

    const element = document.getElementById("spk-template");

    const opt: any = {
      margin: 0, // Margin diset 0 karena padding kertas diatur dari HTML (div spk-template)
      filename: `SPK_${dataMitra?.namaLengkap || "Mitra"}_${month}_${selectedYear}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        windowWidth: 794, // SANGAT PENTING: Kunci lebar render setara A4 (96 DPI)
      },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" }, // Ubah unit ke 'pt'
      pagebreak: { mode: ["css", "legacy"] },
    };

    html2pdf().set(opt).from(element).save();
  };

  // --- TAMBAHKAN KODE INI TEPAT DI ATAS return ( ---

  // 1. Fungsi untuk mengubah angka menjadi huruf (Terbilang)
  const terbilang = (nilai) => {
    nilai = Math.abs(nilai);
    let simpan = "";
    let huruf = [
      "",
      "Satu",
      "Dua",
      "Tiga",
      "Empat",
      "Lima",
      "Enam",
      "Tujuh",
      "Delapan",
      "Sembilan",
      "Sepuluh",
      "Sebelas",
    ];
    if (nilai < 12) {
      simpan = " " + huruf[nilai];
    } else if (nilai < 20) {
      simpan = terbilang(nilai - 10) + " Belas";
    } else if (nilai < 100) {
      simpan =
        terbilang(Math.floor(nilai / 10)) + " Puluh" + terbilang(nilai % 10);
    } else if (nilai < 200) {
      simpan = " Seratus" + terbilang(nilai - 100);
    } else if (nilai < 1000) {
      simpan =
        terbilang(Math.floor(nilai / 100)) + " Ratus" + terbilang(nilai % 100);
    } else if (nilai < 2000) {
      simpan = " Seribu" + terbilang(nilai - 1000);
    } else if (nilai < 1000000) {
      simpan =
        terbilang(Math.floor(nilai / 1000)) + " Ribu" + terbilang(nilai % 1000);
    } else if (nilai < 1000000000) {
      simpan =
        terbilang(Math.floor(nilai / 1000000)) +
        " Juta" +
        terbilang(nilai % 1000000);
    }
    return simpan;
  };
  // Fungsi untuk mengubah 'Tanggal Lapangan' (item.tanggal) menjadi Jangka Waktu SPK
  const formatTanggalLapangan = (item) => {
    // 1. Cari tahu tanggal terakhir pada bulan yang dipilih (misal Desember = 31)
    const namaBulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const indexBulan = namaBulan.findIndex(
      (b) => b.toLowerCase() === month.toLowerCase(),
    );
    const tanggalTerakhir = new Date(
      Number(selectedYear),
      indexBulan + 1,
      0,
    ).getDate();

    const tanggalMulai = getTanggalTTD(month, Number(selectedYear));

    // 2. Ambil isi dari kolom Tanggal Lapangan
    const tglLapangan = String(item.tanggal || "").trim();

    // 3. Jika formatnya rentang hari (contoh: "24-25" atau "10-15")
    if (tglLapangan.includes("-")) {
      const [start, end] = tglLapangan.split("-");
      return `${start.trim()} s.d ${end.trim()} ${month} ${selectedYear}`;
    }

    // 4. Jika formatnya teks ("Mingguan", "Dwimingguan", "Bulanan") atau kosong
    // Maka standarnya adalah dianggap full 1 bulan penuh
    return `${tanggalMulai.getDate()} s.d ${tanggalTerakhir} ${month} ${selectedYear}`;
  };

  // 2. Persiapan Data Dinamis untuk SPK
  const kegiatanPertama =
    rincianTable && rincianTable.length > 0 ? rincianTable[0] : null;
  const noKontrakSPK = kegiatanPertama?.no_kontrak_spk || "...................";
  const jenisKegiatan = kegiatanPertama?.kegiatan || "Pendataan Lapangan";
  const kecamatanMitra = kegiatanPertama?.kecamatan || "...................";

  // 3. Olah Tanggal & Hari
  const startDateObj = kegiatanPertama?.tanggal_mulai
    ? new Date(kegiatanPertama.tanggal_mulai)
    : new Date();
  const namaHari = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ][startDateObj.getDay()];
  const tanggalMulaiNum = startDateObj.getDate();

  // Hitung jumlah hari di bulan yang sedang dipilih (contoh: Desember = 31 hari)
  const namaBulanArr = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const indexBulan = namaBulanArr.findIndex(
    (b) => b.toLowerCase() === month.toLowerCase(),
  );
  const tanggalTerakhir = new Date(
    Number(selectedYear),
    indexBulan + 1,
    0,
  ).getDate();
  // ===== FUNGSI HITUNG TANGGAL PENANDATANGANAN =====
  const getTanggalTTD = (bulan, tahun) => {
    if (!bulan) return null;
    const bulanIndex = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ].findIndex((b) => b.toLowerCase() === bulan.toLowerCase());
    if (bulanIndex === -1) return null;

    const tgl1 = new Date(tahun, bulanIndex, 1);
    let tgl = new Date(tgl1);
    tgl.setDate(tgl.getDate()); // mundur satu hari

    const isWeekend = (date) => {
      const day = date.getDay(); // 0 = Minggu, 6 = Sabtu
      return day === 0 || day === 6;
    };

    // terus mundur sampai dapat hari kerja (Senin-Jumat)
    while (isWeekend(tgl)) {
      tgl.setDate(tgl.getDate() + 1);
    }
    return tgl;
  };

  const tglTTD = getTanggalTTD(month, Number(selectedYear));
  let hariTTD = "",
    tglTTDTerbilang = "",
    bulanTTD = "",
    tahunTTDTerbilang = "";

  if (tglTTD) {
    const hariList = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const bulanList = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    hariTTD = hariList[tglTTD.getDay()];
    tglTTDTerbilang = terbilang(tglTTD.getDate()).trim(); // "satu", "dua", ..., "tiga puluh satu"
    bulanTTD = bulanList[tglTTD.getMonth()];
    tahunTTDTerbilang = terbilang(tglTTD.getFullYear()).trim(); // "dua ribu dua puluh enam"
  }
  // 4. Olah Tahun Huruf
  const tahunMap = {
    "2024": "Dua Ribu Dua Puluh Empat",
    "2025": "Dua Ribu Dua Puluh Lima",
    "2026": "Dua Ribu Dua Puluh Enam",
    "2027": "Dua Ribu Dua Puluh Tujuh",
  };
  const tahunTerbilang = tahunMap[selectedYear] || selectedYear;
  const totalRupiahTerbilang = totalHonor
    ? terbilang(totalHonor).trim() + " Rupiah"
    : "-";

  // ------------------------------------------------

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
      <div className="space-y-4 p-4 bg-gray-50 min-h-screen">
        <div className="border-b bg-white border-gray-200 sticky top-14 z-10 mb-4">
          {submenuTabs}
        </div>
        <div>
          {activeTab === "rekap" && (
            <div className="flex min-h-screen">
              <main className="flex-1 overflow-y-auto">
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Pilih Bulan
                    </h3>
                    <select
                      id="tahun"
                      value={selectedYear}
                      onChange={(e) => {
                        const year = e.target.value;
                        setSelectedYear(year);
                        getRekapHonorPerBulan(Number(year));
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={""}>Pilih Tahun</option>
                      {years.map((year, index) => (
                        <option key={index} value={year.year}>
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
                          const monthData = rekapHonorPerBulan?.find(
                            (item) => item.bulan === month,
                          );

                          return (
                            <div
                              key={i}
                              className="flex-none h-28 w-56 min-w-[12rem] bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 cursor-pointer transition-all hover:shadow-md"
                              onClick={() => setMonth(month)}
                            >
                              <h4 className="font-semibold text-blue-700 mb-1 text-sm">
                                {month}
                              </h4>
                              <div className="flex items-center text-sm font-mono font-semibold text-blue-700 bg-white px-2 py-1 rounded">
                                Rp{" "}
                                {(monthData?.total || 0).toLocaleString(
                                  "id-ID",
                                )}
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
                              carouselRef.current.scrollTo({
                                left: cardWidth * i,
                                behavior: "smooth",
                              });
                              setActiveIndex(i);
                            }
                          }}
                          className={`w-3 h-3 mx-1 rounded-full transition-colors duration-300 ${
                            i === activeIndex % 5
                              ? "bg-blue-600"
                              : "bg-gray-400"
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
              <div className="justify-end flex mb-3">
                <select
                  id="tahun"
                  value={selectedYear}
                  onChange={(e) => {
                    const year = e.target.value;
                    setSelectedYear(year);
                    getRincianHonorData(Number(year));
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={""}>Pilih Tahun</option>
                  {years.map((year, index) => (
                    <option key={index} value={year.year}>
                      {year.year}
                    </option>
                  ))}
                </select>
              </div>
              <Table
                columns={columns}
                data={detailHonorData}
                getCellProps={getCellClassName}
                isLoading={isLoading}
              />
              {expandedSection && (
                <div className="col">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Rincian Kegiatan Mitra{" "}
                      <span className="bg-blue-100 text-blue-700 py-1 px-2 rounded text-xs font-medium">
                        {dataMitra?.namaLengkap}
                      </span>{" "}
                      bulan{" "}
                      <span className="bg-blue-100 text-blue-700 py-1 px-2 rounded text-xs font-medium">
                        {month}
                      </span>{" "}
                    </h4>

                    {rincianTable?.length > 0 && (
                      <button
                        onClick={handleExportSPK}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.249 0 .45.05.603.154a.89.89 0 0 1 .315.434c.068.202.104.453.104.753 0 .298-.036.549-.104.751a.87.87 0 0 1-.32.432c-.152.104-.351.156-.598.156h-.563v-2.68Zm3.198 0v2.605h.624v.65h-1.42v-3.999h1.42v.644H7.35Z"
                          />
                        </svg>
                        Cetak SPK (PDF)
                      </button>
                    )}
                  </div>
                  <div className="mt-2 mb-4">
                    <div className="bg-white rounded-lg border border-gray-300 block overflow-hidden">
                      <table className="text-sm w-full text-sm text-left dark:text-gray-400">
                        <thead className="text-xs uppercase bg-blue-600 text-white dark:bg-blue-600 dark:text-white sticky top-0">
                          <tr>
                            <th
                              scope="col"
                              className="px-3 py-2 text-xs font-semibold"
                            >
                              No.
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-2 text-xs font-semibold"
                            >
                              Kegiatan
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-xs font-semibold"
                            >
                              Tim
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-xs font-semibold"
                            >
                              Volume
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-xs font-semibold"
                            >
                              Satuan
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-xs font-semibold"
                            >
                              Harga Per Satuan
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-2 text-xs font-semibold"
                            >
                              Honor
                            </th>
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
                                <tr
                                  key={index}
                                  className="border-b border-gray-300 hover:bg-gray-50"
                                >
                                  <td className="px-3 py-1 text-xs font-medium text-gray-900">
                                    {index + 1}.
                                  </td>
                                  <td className="px-3 py-1 text-xs font-medium text-gray-900">
                                    {kegmitra.nama_survei || kegmitra.kegiatan}
                                  </td>
                                  <td className="px-2 py-1 text-xs font-medium text-gray-900">
                                    {kegmitra.tim}
                                  </td>
                                  <td className="px-2 py-1 text-xs font-medium text-gray-900">
                                    {kegmitra.volum}
                                  </td>
                                  <td className="px-2 py-1 text-xs font-medium text-gray-900">
                                    {kegmitra.satuan}
                                  </td>
                                  <td className="px-2 py-1 text-xs font-mono text-gray-900">
                                    {toRupiah(kegmitra.harga_per_satuan)}
                                  </td>
                                  <td className="px-3 py-1 text-xs font-mono font-semibold text-gray-900">
                                    {toRupiah(kegmitra.jumlah)}
                                  </td>
                                </tr>
                              ))}

                              <tr className="font-semibold bg-gray-50 border-t border-gray-300">
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className="px-2 py-1 text-xs">TOTAL</td>
                                <td className="px-3 py-1 text-xs font-mono text-gray-900">
                                  {toRupiah(totalHonor)}
                                </td>
                              </tr>
                            </>
                          ) : (
                            <tr>
                              <td
                                colSpan={7}
                                className="text-center text-xs px-4 py-4 text-xs"
                              >
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
      {/* ===== TEMPLATE PDF SPK TERSEMBUNYI ===== */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <div
          id="spk-template"
          className="bg-white text-black"
          style={{
            fontFamily: '"Bookman Old Style", serif',
            fontSize: "12pt",
            lineHeight: "1.5",
            width: "794px",
            minHeight: "1123px",
            padding: "60px 80px",
            boxSizing: "border-box",
          }}
        >
          {/* COVER & JUDUL */}
          <div style={{ pageBreakInside: "avoid" }}>
            <div className="text-center font-bold mb-8 leading-tight">
              <p className="uppercase mb-1">PERJANJIAN KERJA</p>
              <p className="uppercase mb-1">PETUGAS {jenisKegiatan}</p>
              <p className="mb-1">
                PADA BADAN PUSAT STATISTIK KABUPATEN BOJONEGORO
              </p>
              <p>NOMOR: {noKontrakSPK}</p>
            </div>

            {/* PEMBUKA */}
            <div className="mb-6 text-justify">
              <p>
                Pada hari ini, {hariTTD} tanggal {tglTTDTerbilang} bulan{" "}
                {bulanTTD} tahun {tahunTTDTerbilang} bertempat di Kabupaten
                Bojonegoro, yang bertanda tangan di bawah ini:
              </p>
            </div>

            {/* PIHAK PERTAMA & KEDUA (tabel 3 kolom) */}
            <table className="w-full mb-6" style={{ fontSize: "11.5pt" }}>
              <tbody>
                <tr>
                  <td
                    className="align-top pb-3"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    (1) Drs. Koernia Novijanantho
                  </td>
                  <td className="align-top pb-3 px-2">:</td>
                  <td className="text-justify pb-3">
                    Pejabat Pembuat Komitmen Badan Pusat Statistik Kabupaten
                    Bojonegoro, berkedudukan di Bojonegoro, bertindak untuk dan
                    atas nama Badan Pusat Statistik Jl. Sawunggaling No.62,
                    Ngrowo, Kabupaten, Kec. Bojonegoro, Kabupaten Bojonegoro,
                    selanjutnya disebut sebagai <strong>PIHAK PERTAMA</strong>.
                  </td>
                </tr>
                <tr>
                  <td className="align-top">(2) {dataMitra?.namaLengkap}</td>
                  <td className="align-top px-2">:</td>
                  <td className="text-justify">
                    Petugas {jenisKegiatan}, berkedudukan di Kecamatan{" "}
                    {kecamatanMitra}, bertindak untuk dan atas nama diri
                    sendiri, selanjutnya disebut sebagai{" "}
                    <strong>PIHAK KEDUA</strong>.
                  </td>
                </tr>
              </tbody>
            </table>

            {/* KLAUSUL */}
            <div className="mb-6 text-justify">
              <p>
                bahwa <strong>PIHAK PERTAMA</strong> dan{" "}
                <strong>PIHAK KEDUA</strong> yang secara bersama-sama disebut{" "}
                <strong>PARA PIHAK</strong>, sepakat untuk mengikatkan diri
                dalam Perjanjian Kerja Petugas {jenisKegiatan} pada Badan Pusat
                Statistik Kabupaten Bojonegoro Nomor: {noKontrakSPK}, yang
                selanjutnya disebut Perjanjian, dengan ketentuan-ketentuan
                sebagai berikut:
              </p>
            </div>
          </div>

          {/* PASAL 1 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <div className="text-center font-bold mt-6 mb-2">Pasal 1</div>
            <p className="text-justify mb-4">
              <strong>PIHAK PERTAMA</strong> memberikan pekerjaan kepada{" "}
              <strong>PIHAK KEDUA</strong> dan <strong>PIHAK KEDUA</strong>{" "}
              menerima pekerjaan dari <strong>PIHAK PERTAMA</strong> sebagai
              Petugas {jenisKegiatan} pada Badan Pusat Statistik Kabupaten
              Bojonegoro, dengan lingkup pekerjaan yang ditetapkan oleh{" "}
              <strong>PIHAK PERTAMA</strong>.
            </p>
          </div>

          {/* PASAL 2 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <div className="text-center font-bold mt-6 mb-2">Pasal 2</div>
            <p className="text-justify mb-4">
              Ruang lingkup pekerjaan dalam Perjanjian ini mengacu pada wilayah
              kerja dan beban kerja sebagaimana tertuang dalam lampiran
              Perjanjian, dan ketentuan-ketentuan lainnya yang ditetapkan oleh{" "}
              <strong>PIHAK PERTAMA</strong>.
            </p>
          </div>

          {/* PASAL 3 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <div className="text-center font-bold mt-6 mb-2">Pasal 3</div>
            <p className="text-justify mb-4">
              Jangka waktu Perjanjian ini terhitung sejak {tanggalMulaiNum}{" "}
              {month} {selectedYear} sampai dengan {tanggalTerakhir} {month}{" "}
              {selectedYear}.
            </p>
          </div>

          {/* PASAL 4 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <div className="text-center text-black-500 mt-6 mb-2">2</div>
            <div className="text-center font-bold mt-6 mb-2">Pasal 4</div>
            <ol className="text-justify mb-4 list-decimal pl-5">
              <li className="pl-1 mb-1">
                <strong>PIHAK KEDUA</strong> berkewajiban menyelesaikan
                pekerjaan yang diberikan oleh <strong>PIHAK PERTAMA</strong>{" "}
                sesuai ruang lingkup pekerjaan sebagaimana dimaksud dalam Pasal
                2.
              </li>
              <li className="pl-1">
                <strong>PIHAK KEDUA</strong> untuk waktu yang tidak terbatas
                dan/atau tidak terikat kepada masa berlakunya Perjanjian ini,
                menjamin untuk memberlakukan sebagai rahasia setiap
                data/informasi yang diterima atau diperolehnya dari{" "}
                <strong>PIHAK PERTAMA</strong>, serta menjamin bahwa keterangan
                demikian hanya dipergunakan untuk melaksanakan tujuan menurut
                Perjanjian ini.
              </li>
            </ol>
          </div>

          {/* PASAL 5 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <div className="text-center font-bold mt-6 mb-2">Pasal 5</div>
            <ol className="text-justify mb-4 list-none">
              <li className="mb-1">
                (1) <strong>PIHAK KEDUA</strong> apabila melakukan peminjaman
                dokumen/data/aset milik <strong>PIHAK PERTAMA</strong>, wajib
                menjaga dan menggunakan sesuai dengan tujuan perjanjian dan
                mengembalikan dalam keadaan utuh sama dengan saat peminjaman,
                serta dilarang menggandakan, menyalin, menunjukkan, dan/atau
                mendokumentasikan dalam bentuk foto atau bentuk apapun untuk
                kepentingan pribadi ataupun kepentingan lain yang tidak
                berkaitan dengan tujuan perjanjian ini.
              </li>
              <li>
                (2) <strong>PIHAK KEDUA</strong> dilarang memberikan
                dokumen/data/aset milik <strong>PIHAK PERTAMA</strong> yang
                berada dalam penguasaan <strong>PIHAK KEDUA</strong>, baik
                secara langsung maupun tidak langsung, termasuk memberikan akses
                kepada pihak lain untuk menggunakan, menyalin, memfotokopi,
                menunjukkan, dan/atau mendokumentasikan dalam bentuk foto atau
                bentuk apapun, sehingga informasi diketahui oleh pihak lain
                untuk tujuan apapun.
              </li>
            </ol>
          </div>

          {/* PASAL 6 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <div className="text-center font-bold mt-6 mb-2">Pasal 6</div>
            <ol className="text-justify mb-4 list-none">
              <li className="mb-1">
                (1) <strong>PIHAK KEDUA</strong> berhak untuk mendapatkan
                honorarium dari <strong>PIHAK PERTAMA</strong> sesuai ketentuan
                yang berlaku dan anggaran yang tersedia untuk pekerjaan
                sebagaimana dimaksud dalam Pasal 2, termasuk biaya pajak dan bea
                meterai.
              </li>
              <li>
                (2) Honorarium sebagaimana dimaksud pada ayat (1) dibayarkan
                oleh <strong>PIHAK PERTAMA</strong> kepada{" "}
                <strong>PIHAK KEDUA</strong> setelah menyelesaikan seluruh
                pekerjaan yang ditargetkan sebagaimana tercantum dalam Lampiran
                Perjanjian, dituangkan dalam Berita Acara Serah Terima Hasil
                Pekerjaan.
              </li>
            </ol>
          </div>

          {/* PASAL 7 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <div className="text-center font-bold mt-6 mb-2">Pasal 7</div>
            <ol className="text-justify mb-4 list-none">
              <li className="mb-1">
                (1) Pembayaran honorarium sebagaimana dimaksud dalam Pasal 6,
                dilakukan setelah <strong>PIHAK KEDUA</strong> menyelesaikan dan
                menyerahkan hasil pekerjaan sesuai dengan kegiatan pekerjaan
                yang dilakukan sebagaimana dimaksud dalam Pasal 2 kepada{" "}
                <strong>PIHAK PERTAMA</strong>.
              </li>
              <li>
                (2) Pembayaran sebagaimana dimaksud pada ayat (1) dilakukan oleh{" "}
                <strong>PIHAK PERTAMA</strong> kepada{" "}
                <strong>PIHAK KEDUA</strong> sesuai dengan ketentuan peraturan
                perundang-undangan.
              </li>
            </ol>
          </div>

          {/* PASAL 8 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <div className="text-center text-black-500 mt-6 mb-2">3</div>
            <div className="text-center font-bold mt-6 mb-2">Pasal 8</div>
            <ol className="text-justify mb-4 list-[lower-alpha] pl-5">
              <li className="pl-1 mb-1">
                <strong>PIHAK PERTAMA</strong> secara berjenjang melakukan
                pemeriksaan dan evaluasi atas target penyelesaian dan kualitas
                hasil pekerjaan yang dilaksanakan oleh{" "}
                <strong>PIHAK KEDUA</strong>.
              </li>
              <li className="pl-1">
                Hasil pemeriksaan dan evaluasi sebagaimana dimaksud pada ayat
                (1) menjadi dasar pembayaran honorarium{" "}
                <strong>PIHAK KEDUA</strong> oleh <strong>PIHAK PERTAMA</strong>{" "}
                sebagaimana dimaksud dalam Pasal 6 ayat (2), yang dituangkan
                dalam Berita Acara Serah Terima Hasil Pekerjaan yang
                ditandatangani oleh <strong>PARA PIHAK</strong>.
              </li>
            </ol>
          </div>

          {/* PASAL 9 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <div className="text-center font-bold mt-6 mb-2">Pasal 9</div>
            <p className="text-justify mb-4">
              <strong>PIHAK PERTAMA</strong> dapat memutuskan Perjanjian ini
              secara sepihak sewaktu-waktu dalam hal{" "}
              <strong>PIHAK KEDUA</strong> tidak dapat melaksanakan kewajibannya
              sebagaimana dimaksud dalam Pasal 4 dengan menerbitkan Surat
              Pemutusan Perjanjian Kerja.
            </p>
          </div>

          {/* PASAL 10 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <div className="text-center font-bold mt-6 mb-2">Pasal 10</div>
            <ol className="text-justify mb-4 list-none">
              <li className="mb-1">
                (1) Apabila <strong>PIHAK KEDUA</strong> mengundurkan diri
                dengan tidak menyelesaikan pekerjaan sebagaimana dimaksud dalam
                Pasal 2, maka akan diberikan sanksi oleh{" "}
                <strong>PIHAK PERTAMA</strong>, sebagai berikut:
                <ol className="list-none pl-6 mt-1">
                  <li className="mb-1">
                    (1) mengundurkan diri setelah pelatihan dan belum mengikuti
                    kegiatan diberikan sanksi sebesar biaya pelatihan.
                  </li>
                  <li>
                    (2) mengundurkan diri pada saat pelaksanaan pekerjaan,
                    diberikan sanksi tidak diberikan honorarium atas pekerjaan
                    yang telah dilaksanakan.
                  </li>
                </ol>
              </li>
              <li className="mb-1">
                (2) Dikecualikan tidak dikenakan sanksi sebagaimana dimaksud
                pada ayat (1) oleh <strong>PIHAK PERTAMA</strong>, apabila{" "}
                <strong>PIHAK KEDUA</strong> meninggal dunia, mengundurkan diri
                karena sakit dengan keterangan rawat inap, kecelakaan dengan
                keterangan kepolisian, dan/atau telah diberikan Surat Pemutusan
                Perjanjian Kerja dari <strong>PIHAK PERTAMA</strong>.
              </li>
              <li>
                (3) Dalam hal terjadi peristiwa sebagaimana dimaksud pada ayat
                (2), <strong>PIHAK PERTAMA</strong> membayarkan honorarium
                kepada <strong>PIHAK KEDUA</strong> secara proporsional sesuai
                pekerjaan yang telah dilaksanakan.
              </li>
            </ol>
          </div>

          {/* PASAL 11 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <div className="text-center font-bold mt-6 mb-2">Pasal 11</div>
            <ol className="text-justify mb-4 list-none">
              <li className="mb-1">
                (1) Apabila terjadi Keadaan Kahar, yang meliputi bencana alam,
                bencana nonalam, dan bencana sosial,{" "}
                <strong>PIHAK KEDUA</strong> memberitahukan kepada{" "}
                <strong>PIHAK PERTAMA</strong> dalam waktu paling lambat 14
                (empat belas) hari sejak mengetahui atas kejadian Keadaan Kahar
                dengan menyertakan bukti.
              </li>
              <li className="mb-1">
                (2) Dalam hal terjadi peristiwa sebagaimana dimaksud pada ayat
                (1) pelaksanaan pekerjaan oleh <strong>PIHAK KEDUA</strong>{" "}
                dihentikan sementara dan dilanjutkan kembali setelah Keadaan
                Kahar berakhir, merujuk pada ketentuan yang ditetapkan oleh{" "}
                <strong>PIHAK PERTAMA</strong>.
              </li>
            </ol>
          </div>

          {/* LANJUTAN PASAL 11 & PASAL 12 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <div className="text-center text-gray-500 mt-6 mb-6">4</div>

            {/* Lanjutan Pasal 11 Ayat 3 */}
            <ol className="text-justify mb-4 list-none">
              <li>
                (3) Apabila akibat Keadaan Kahar tidak memungkinkan
                dilanjutkan/diselesaikannya pelaksanaan pekerjaan,{" "}
                <strong>PIHAK KEDUA</strong> berhak menerima honorarium secara
                proporsional sesuai pekerjaan yang telah diselesaikan dan
                diterima oleh <strong>PIHAK PERTAMA</strong>.
              </li>
            </ol>

            {/* Pasal 12 */}
            <div className="text-center font-bold mt-6 mb-2">Pasal 12</div>
            <p className="text-justify mb-4">
              Hal-hal yang belum diatur dalam Perjanjian ini atau segala
              perubahan terhadap Perjanjian ini diatur lebih lanjut oleh{" "}
              <strong>PARA PIHAK</strong> dalam perjanjian tambahan/adendum dan
              merupakan bagian tidak terpisahkan dari Perjanjian ini.
            </p>
          </div>

          {/* PASAL 13 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <div className="text-center font-bold mt-6 mb-2">Pasal 13</div>
            <ol className="text-justify mb-4 list-none">
              <li className="mb-1">
                (1) Segala perselisihan atau perbedaan pendapat yang mungkin
                timbul sebagai akibat dari Perjanjian ini, diselesaikan secara
                musyawarah untuk mufakat oleh <strong>PARA PIHAK</strong>.
              </li>
              <li className="mb-1">
                (2) Apabila musyawarah untuk mufakat sebagaimana dimaksud pada
                ayat (1) tidak berhasil, maka <strong>PARA PIHAK</strong>{" "}
                sepakat untuk menyelesaikan perselisihan dengan memilih
                kedudukan/domisili hukum di Kepaniteraan Pengadilan Negeri
                Kabupaten Bojonegoro.
              </li>
              <li>
                (3) Selama perselisihan dalam proses penyelesaian pengadilan,{" "}
                <strong>PIHAK PERTAMA</strong> dan <strong>PIHAK KEDUA</strong>{" "}
                wajib tetap melaksanakan kewajiban masing-masing berdasarkan
                Perjanjian ini.
              </li>
            </ol>
          </div>

          {/* PENUTUP & TTD */}
          <div style={{ pageBreakInside: "avoid" }}>
            <p className="text-justify mt-8 mb-16">
              Demikian Perjanjian ini dibuat dan ditandatangani oleh{" "}
              <strong>PARA PIHAK</strong> dalam 2 (dua) rangkap asli bermeterai
              cukup, tanpa paksaan dari PIHAK manapun dan untuk dilaksanakan
              oleh <strong>PARA PIHAK</strong>.
            </p>

            <table
              className="w-full mt-16 text-center"
              style={{ fontSize: "11.5pt", pageBreakInside: "avoid" }}
            >
              <tbody>
                <tr>
                  <td className="w-1/2 align-top">
                    <strong>PIHAK KEDUA,</strong>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <span className="underline font-bold">
                      {dataMitra?.namaLengkap}
                    </span>
                  </td>
                  <td className="w-1/2 align-top">
                    <strong>PIHAK PERTAMA,</strong>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <span className="underline font-bold">
                      Drs. Koernia Novijanantho
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* HALAMAN LAMPIRAN */}
          <div className="html2pdf__page-break"></div>
          <div style={{ height: "50px" }}></div>

          <div style={{ pageBreakInside: "avoid" }}>
            <div className="text-center font-bold mb-8 leading-tight">
              <p className="mb-1">LAMPIRAN I</p>
              <p className="mb-1 uppercase">
                PERJANJIAN KERJA PETUGAS {jenisKegiatan}
              </p>
              <p className="mb-1 uppercase">
                PADA BADAN PUSAT STATISTIK KABUPATEN BOJONEGORO
              </p>
              <p className="uppercase">NOMOR: {noKontrakSPK}</p>
            </div>

            <div className="text-center font-bold mb-6">
              DAFTAR URAIAN TUGAS, JANGKA WAKTU, TARGET PEKERJAAN DAN NILAI
              PERJANJIAN
            </div>

            {/* TABEL LAMPIRAN (5 kolom) */}
            <table
              className="w-full border-collapse border border-black text-center mb-8"
              style={{ fontSize: "11pt", pageBreakInside: "avoid" }}
            >
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-3 w-3/12 align-middle">
                    Uraian Tugas
                  </th>
                  <th className="border border-black p-3 w-2/12 align-middle">
                    Jangka Waktu
                  </th>
                  <th
                    className="border border-black p-3 w-2/12 align-middle"
                    colSpan={2}
                  >
                    Target Pekerjaan
                  </th>
                  <th className="border border-black p-3 w-2/12 align-middle">
                    Nilai Perjanjian (Rp)
                  </th>
                </tr>
                <tr className="bg-gray-50 italic text-[10pt]">
                  <th className="border border-black p-1">(1)</th>
                  <th className="border border-black p-1">(2)</th>
                  <th className="border border-black p-1">(3)</th>
                  <th className="border border-black p-1">(4)</th>
                  <th className="border border-black p-1">(5)</th>
                </tr>
              </thead>
              <tbody>
                {rincianTable?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border border-black p-3 text-left">
                      {idx + 1}. {item.kegiatan} {item.nama_survei}
                    </td>
                    <td className="border border-black p-3">
                      {formatTanggalLapangan(item)}
                    </td>
                    <td className="border border-black p-3">{item.volum}</td>
                    <td className="border border-black p-3">{item.satuan}</td>
                    <td className="border border-black p-3 text-right">
                      {new Intl.NumberFormat("id-ID").format(item.jumlah)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td
                    colSpan={4}
                    className="border border-black p-3 text-left italic"
                  >
                    <strong>Terbilang:</strong> {totalRupiahTerbilang}
                  </td>
                  <td className="border border-black p-3 font-bold text-right bg-gray-50 whitespace-nowrap">
                    Rp {new Intl.NumberFormat("id-ID").format(totalHonor)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
