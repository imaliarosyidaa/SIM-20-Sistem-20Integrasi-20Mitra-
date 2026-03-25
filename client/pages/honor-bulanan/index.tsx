import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Edit3,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@components/ui/input";
import { Link } from "react-router-dom";
import ComboBox from "@/components/combobox";
import Skeleton from "react-loading-skeleton";
import { KegiatanMitraResponse } from "@/interfaces/types";
import useUserApi from "@/lib/userApi";
import useKegiatanMitraApi from "@/lib/kegaiatanMitraApi";
import { months } from "../../constants";
import useKegiatanApi from "@/lib/kegiatanApi";
import { AlertDialog } from "@/components/alertdialog";
import filterApi from "@/lib/filterApi";
import { Alert, Tooltip } from "@mui/material";
import html2pdf from "html2pdf.js";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

export default function HonorBulanan() {
  const [kegiatanMitra, setKegiatanMitra] = useState<KegiatanMitraResponse[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [expandedInputRows, setExpandedInputRows] = useState<number[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const [years, setYears] = useState<any[]>([]);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(
    Number(currentYear).toString(),
  );
  const { getTahun } = filterApi();

  const [tim, setTim] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const { getAllUsers } = useUserApi();
  const { deleteKegiatan } = useKegiatanApi();
  const {
    editKegiatanMitra,
    getKegiatanMitra,
    createKegiatanMitra,
    deleteKegiatanMitra,
    getKegiatanById,
  } = useKegiatanMitraApi();
  const [formData, setFormData] = useState({
    id: "",
    volum: "",
    harga_per_satuan: "",
    id_sobat: "",
    pcl_pml_olah: "",
    satuan: "",
    kecamatan: "",
    no_kontrak_spk: "",
    no_kontrak_bast: "",
    no_urut_mitra: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
  const [progressInfo, setProgressInfo] = useState("");

  const totalPages = Math.ceil(kegiatanMitra?.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = kegiatanMitra?.slice(indexOfFirstRow, indexOfLastRow);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formRef = useRef<HTMLDivElement>(null);
  const dataMitraRef = useRef<HTMLDivElement>(null);

  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const [mitraData, setMitraData] = useState([]);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev?.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const toggleRowInput = (id: number) => {
    clear();
    setExpandedInputRows((prev) =>
      prev.includes(id) ? prev?.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const toggleSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev?.filter((row) => row !== id) : [...prev, id],
    );
  };

  async function fetchData(selectedYear, selectedMonth, tim) {
    setIsLoading(true);
    Promise.all([
      getKegiatanMitra(selectedYear, selectedMonth, tim),
      await getAllUsers(),
    ])
      .then(([kegMitra, users]) => {
        setKegiatanMitra(kegMitra);
        setMitraData(
          users.map((user) => ({
            id: user.id,
            namaLengkap: user.namaLengkap,
            sobatId: user.sobatId,
          })),
        );
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }

  // State khusus untuk menampung antrean cetak massal PDF
  const [bulkPdfData, setBulkPdfData] = useState<any[]>([]);

  async function fetchTahun() {
    getTahun()
      .then((res) => {
        setYears(res);
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    fetchData(selectedYear, selectedMonth, tim);
    fetchTahun();
  }, [selectedYear, selectedMonth, tim]);

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value, 10) || 0 : value,
    }));
  };

  function clear() {
    setFormData({
      id: "",
      volum: "",
      harga_per_satuan: "",
      id_sobat: "",
      pcl_pml_olah: "",
      satuan: "",
      kecamatan: "",
      no_kontrak_spk: "",
      no_kontrak_bast: "",
      no_urut_mitra: "",
    });
  }

  async function handleFormSubmit(event, kegiatan) {
    event.preventDefault();
    console.log(formData);

    if (formData.id) {
      const payload = {
        ...formData,
        jumlah: Number(formData.harga_per_satuan) * Number(formData.volum),
      };
      editKegiatanMitra(payload)
        .then(() => {
          fetchData(selectedYear, selectedMonth, tim);
          clear();
          setSuccess("Update Berhasil! Data petugas telah diperbarui.");
          setTimeout(() => {
            dataMitraRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 100);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setIsLoading(false);
          clear();
        });
    } else {
      const payload = {
        ...formData,
        kegiatanId: kegiatan.kodeKegiatan,
        jumlah: Number(formData.harga_per_satuan) * Number(formData.volum),
      };
      createKegiatanMitra(payload)
        .then(() => {
          fetchData(selectedYear, selectedMonth, tim);
          clear();
          setSuccess(
            "Berhasil! Data kegiatan baru telah ditambahkan ke sistem.",
          );
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  async function deleteData(id) {
    setError(null);
    setIsLoading(true);
    console.log(id);
    deleteKegiatanMitra(id)
      .then(() => {
        setKegiatanMitra((prev) =>
          prev.map((group) => ({
            ...group,
            mitra: group.mitra?.filter((m) => m.id !== id),
          })),
        );
      })
      .catch((err) => {
        console.error("Gagal hapus kegiatan:", err);
      })
      .finally(() => setIsLoading(false));
  }

  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState({ type: "", id: null });

  const handleOpenDialog = (type: string, id: number) => {
    setTarget({ type, id });
    setOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!target.id) return;

    switch (target.type) {
      case "mitra":
        deleteData(target.id);
        break;
      case "kegiatan":
        handleDeleteKegiatan(target.id);
        break;
    }

    setOpen(false);
    setTarget({ type: "", id: null });
  };

  async function handleDeleteKegiatan(id: number) {
    setIsLoading(true);
    deleteKegiatan(id)
      .then(() => {
        setKegiatanMitra((prev) =>
          prev.filter((kegiatan) => kegiatan.id !== id),
        );
      })
      .catch((err) => {
        console.error("Gagal hapus kegiatan:", err);
      })
      .finally(() => setIsLoading(false));
  }

  const resetFilters = () => {
    setSelectedYear("");
    setSelectedMonth("");
  };

  async function handleEditKegiatan(pcl: any) {
    setFormData((prev) => ({
      ...prev,
      id: pcl.id,
      id_sobat: pcl.id_sobat,
      nama_petugas: pcl.nama_petugas,
      no_urut_mitra: pcl.no_urut_mitra,
      pcl_pml_olah: pcl.pcl_pml_olah,
      satuan: pcl.satuan,
      volum: pcl.volum,
      harga_per_satuan: pcl.harga_per_satuan,
      kecamatan: pcl.kecamatan,
      no_kontrak_spk: pcl.no_kontrak_spk,
      no_kontrak_bast: pcl.no_kontrak_bast,
    }));

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  function convertTypeKegiatan(name: string) {
    switch (name) {
      case "PENDATAAN_LAPANGAN":
        return "Pendataan Lapangan";
      case "PENGAWASAN_LAPANGAN":
        return "Pengawasan Lapangan";
      case "PENGOLAHAN_LAPANGAN":
        return "Pengolahan Lapangan";
      default:
        return name;
    }
  }

  const [showAlert, setShowAlert] = useState(true);

  const handleClose = () => {
    setShowAlert(false);
  };

  function convertGender(gander: string) {
    if (gander.toLowerCase() === "lk") {
      return "Laki-laki";
    } else if (gander.toLowerCase() === "pr") {
      return "Perempuan";
    }
    return "-";
  }

  // 1. Fungsi Terbilang
  const terbilang = (nilai: number) => {
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
    if (nilai < 12) simpan = " " + huruf[nilai];
    else if (nilai < 20) simpan = terbilang(nilai - 10) + " Belas";
    else if (nilai < 100)
      simpan =
        terbilang(Math.floor(nilai / 10)) + " Puluh" + terbilang(nilai % 10);
    else if (nilai < 200) simpan = " Seratus" + terbilang(nilai - 100);
    else if (nilai < 1000)
      simpan =
        terbilang(Math.floor(nilai / 100)) + " Ratus" + terbilang(nilai % 100);
    else if (nilai < 2000) simpan = " Seribu" + terbilang(nilai - 1000);
    else if (nilai < 1000000)
      simpan =
        terbilang(Math.floor(nilai / 1000)) + " Ribu" + terbilang(nilai % 1000);
    else if (nilai < 1000000000)
      simpan =
        terbilang(Math.floor(nilai / 1000000)) +
        " Juta" +
        terbilang(nilai % 1000000);
    return simpan;
  };

  // 2. Fungsi Hitung Tanggal TTD
  const getTanggalTTD = (bulan: string, tahun: number) => {
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
    const tgl = new Date(tahun, bulanIndex, 1);
    const isWeekend = (date: Date) =>
      date.getDay() === 0 || date.getDay() === 6;
    while (isWeekend(tgl)) tgl.setDate(tgl.getDate() + 1);
    return tgl;
  };

  // FUNGSI TARIK DATA & RENDER PDF MASSAL (VERSI LOKAL - SANGAT CEPAT)
  const handlePrepareBulkPDF = () => {
    if (!kegiatanMitra || kegiatanMitra.length === 0) {
      alert("Tidak ada data kegiatan untuk dicetak.");
      return;
    }

    if (!selectedMonth) {
      alert("Silakan pilih Bulan terlebih dahulu di filter pencarian atas.");
      return;
    }

    const confirmCetak = window.confirm(
      `Sistem akan menyusun SPK untuk seluruh mitra pada bulan ${selectedMonth}. Lanjutkan?`,
    );
    if (!confirmCetak) return;

    setIsLoading(true);

    try {
      // Mengelompokkan data berdasarkan Mitra tanpa memanggil API Backend
      const groupedData = new Map();
      let counter = 0;

      // 1. Looping semua Kegiatan
      kegiatanMitra.forEach((keg) => {
        if (keg.mitra && Array.isArray(keg.mitra)) {
          // 2. Looping semua Mitra di dalam kegiatan tersebut
          keg.mitra.forEach((pcl) => {
            // Gunakan id_sobat atau nama_petugas sebagai kunci unik
            const mitraKey = pcl.id_sobat || pcl.nama_petugas;

            // Jika mitra ini belum ada di Map, buatkan wadah PDF-nya
            if (!groupedData.has(mitraKey)) {
              groupedData.set(mitraKey, {
                dataMitra: { namaLengkap: pcl.nama_petugas },
                rincianTable: [],
                totalHonor: 0,
                htmlId: `bulk-pdf-${counter}`,
              });
              counter++;
            }

            // Masukkan kegiatan ini ke dalam daftar SPK mitra tersebut
            const group = groupedData.get(mitraKey);

            // Perhitungan rentang tanggal untuk format tabel
            const tglMulai = getTanggalTTD(
              selectedMonth,
              Number(selectedYear),
            )?.getDate();
            const tglAkhirBulan = new Date(
              Number(selectedYear),
              months.findIndex(
                (b) => b.toLowerCase() === selectedMonth.toLowerCase(),
              ) + 1,
              0,
            ).getDate();
            const tglSelesai = keg.tanggal_selesai
              ? new Date(keg.tanggal_selesai).getDate()
              : tglAkhirBulan;

            group.rincianTable.push({
              kegiatan:
                convertTypeKegiatan(keg.jenis_kegiatan) || "Pendataan Lapangan",
              nama_survei: keg.nama_survei,
              tanggal_mulai: keg.tanggal_mulai,
              volum: pcl.volum,
              satuan: pcl.satuan,
              jumlah: pcl.jumlah || pcl.harga_per_satuan * pcl.volum,
              no_kontrak_spk: pcl.no_kontrak_spk,
              kecamatan: pcl.kecamatan,
              tanggal: `${tglMulai} s.d ${tglSelesai}`, // Format "Start-End" agar dibaca otomatis oleh template
            });

            // Tambahkan honor ke total keseluruhan mitra
            group.totalHonor += Number(
              pcl.jumlah || pcl.harga_per_satuan * pcl.volum,
            );
          });
        }
      });

      // 3. Konversi Map menjadi Array agar bisa di-looping oleh template HTML
      const allDataToPrint = Array.from(groupedData.values());

      if (allDataToPrint.length === 0) {
        alert(
          "Data rincian tidak ditemukan. Pastikan kegiatan memiliki data petugas.",
        );
        setIsLoading(false);
        return;
      }

      // 4. Masukkan ke state agar template HTML merender dan useEffect memotretnya
      setBulkPdfData(allDataToPrint);
    } catch (error) {
      console.error("Gagal menyusun data massal:", error);
      alert("Terjadi kesalahan saat memproses data tabel.");
      setIsLoading(false);
    }
  };
  // Efek berjalan otomatis untuk mengekspor PDF setelah state terisi
  useEffect(() => {
    if (bulkPdfData.length > 0) {
      const processIndividualExports = async () => {
        setProgressInfo("Mempersiapkan mesin rendering (Mohon Tunggu)...");

        // Tunggu 3 detik agar browser selesai menyusun tumpukan elemen
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const zipMaster = new PizZip();
        let validPdfCount = 0;

        for (let i = 0; i < bulkPdfData.length; i++) {
          const item = bulkPdfData[i];
          const currentId = `bulk-pdf-${i}`;
          const element = document.getElementById(currentId);

          if (!element) {
            console.warn(`Elemen ${currentId} gagal dimuat oleh DOM.`);
            continue;
          }

          setProgressInfo(
            `Mencetak PDF ${i + 1} dari ${bulkPdfData.length}...`,
          );

          const safeName = (
            item.dataMitra?.namaLengkap || `Mitra_${i}`
          ).replace(/[^a-zA-Z0-9 ]/g, "");
          const fileName = `SPK_${safeName}_${selectedMonth}.pdf`;

          const opt: any = {
            margin: 0, // Margin diset 0 karena padding kertas diatur dari HTML
            filename: fileName,
            image: { type: "jpeg", quality: 1 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              width: 794,
              windowWidth: 794, // SANGAT PENTING: Kunci lebar render setara A4 (96 DPI)
              scrollX: 0,
              scrollY: 0,
              backgroundColor: "#ffffff",
            },
            jsPDF: { unit: "pt", format: "a4", orientation: "portrait" }, // Ubah unit ke 'pt' dan format ke 'A4'
            pagebreak: { mode: ["css", "legacy"] },
          };

          try {
            // KUNCI 3: Gunakan Base64 agar file tidak 0 bytes di dalam ZIP
            let base64Data = "";
            await html2pdf()
              .set(opt)
              .from(element)
              .toPdf()
              .get("pdf")
              .then((pdfInstance: any) => {
                base64Data = pdfInstance
                  .output("datauristring")
                  .split("base64,")[1];
              });

            if (base64Data) {
              zipMaster.file(fileName, base64Data, { base64: true });
              validPdfCount++;
            }

            // Beri jeda 300ms agar RAM punya waktu membersihkan sisa foto
            await new Promise((resolve) => setTimeout(resolve, 300));
          } catch (err) {
            console.error(`Gagal mencetak PDF untuk ${safeName}`, err);
          }
        }

        setProgressInfo("Membungkus 75+ PDF ke dalam ZIP...");

        if (validPdfCount === 0) {
          alert("Gagal memproses PDF. Template HTML blank atau tidak terbaca.");
          setIsLoading(false);
          setProgressInfo("");
          return;
        }

        const finalZipBlob = zipMaster.generate({ type: "blob" });
        saveAs(
          finalZipBlob,
          `SPK_Massal_PDF_${selectedMonth}_${selectedYear}.zip`,
        );

        setBulkPdfData([]);
        setIsLoading(false);
        setProgressInfo("");
        alert(
          `Selesai! Berhasil mengunduh ${validPdfCount} dokumen SPK (PDF) di dalam 1 file ZIP.`,
        );
      };

      processIndividualExports();
    }
  }, [bulkPdfData]);

  return (
    <div className="space-y-4 p-4 bg-gray-50 min-h-screen">
      <div className="w-full bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
        <div className="flex justify-between items-center gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/upload-template" className="flex gap-2 bg-white">
              <Button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-upload"
                  viewBox="0 0 16 16"
                >
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                  <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
                </svg>
                <p>Upload Template</p>
              </Button>
            </Link>

            <button
              onClick={handlePrepareBulkPDF}
              disabled={isLoading}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                {/* ... isi path icon SVG pdf ... */}
              </svg>

              {/* 👇 UBAH BAGIAN TEKS INI 👇 */}
              {isLoading
                ? progressInfo || "Memproses..."
                : "Download Semua SPK (PDF)"}
            </button>
            <select
              id="tahun"
              value={selectedYear}
              onChange={(e) => {
                const year = e.target.value;
                setSelectedYear(year);
                getKegiatanMitra(Number(year), selectedMonth, tim);
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
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => {
                const month = e.target.value;
                setSelectedMonth(month);
                getKegiatanMitra(Number(selectedYear), month, tim);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={""}>Pilih Bulan</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <button
              onClick={resetFilters}
              className="flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset Filter
            </button>
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-3 py-2 text-left text-xs lg:text-sm font-semibold w-8">
                No.
              </th>
              <th className="px-3 py-2 text-left text-xs lg:text-sm font-semibold w-[200px]">
                Judul
              </th>
              <th className="px-3 py-2 text-left text-xs lg:text-sm font-semibold w-[200px]">
                Tanggal Mulai
              </th>
              <th className="px-3 py-2 text-left text-xs lg:text-sm font-semibold w-[100px]">
                Bulan
              </th>
              <th className="px-3 py-2 text-left text-xs lg:text-sm font-semibold w-[200px]">
                Tanggal Selesai
              </th>
              <th className="px-3 py-2 text-left text-xs lg:text-sm font-semibold w-[200px]">
                Tahun
              </th>
              <th className="px-3 py-2 text-left text-xs lg:text-sm font-semibold w-20">
                Tim
              </th>
              <th className="px-3 py-2 text-left text-xs lg:text-sm font-semibold flex-1">
                Nama Survei
              </th>
              <th className="px-3 py-2 text-left text-xs lg:text-sm font-semibold flex-1">
                Jenis Kegiatan
              </th>
              <th className="px-3 py-2 text-center text-xs lg:text-sm font-semibold w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {Array.isArray(currentRows) && currentRows?.length > 0 ? (
              isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-2">
                        <Skeleton height={16} width="70%" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                currentRows.map((kegiatan, index) => (
                  <React.Fragment key={kegiatan.id}>
                    <tr
                      className="border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => toggleRow(kegiatan.id)}
                      key={index}
                    >
                      <td className="px-3 py-2 text-xs lg:text-sm font-semibold text-gray-900 w-8">
                        {index + 1}.
                      </td>
                      <td className="px-3 py-2 text-xs lg:text-sm font-semibold text-gray-900 uppercase">
                        {kegiatan?.judul
                          ? convertTypeKegiatan(kegiatan.jenis_kegiatan)
                          : "-"}
                      </td>
                      <td className="px-3 py-2 text-xs lg:text-sm font-semibold text-gray-900 capitalize">
                        {kegiatan.tanggal_mulai
                          ? new Date(kegiatan.tanggal_mulai).toLocaleDateString(
                              "id-ID",
                              options,
                            )
                          : "-"}
                      </td>
                      <td className="px-3 py-2 text-xs lg:text-sm font-semibold text-gray-900 capitalize">
                        {kegiatan.bulan}
                      </td>
                      <td className="px-3 py-2 text-xs lg:text-sm font-semibold text-gray-900 capitalize">
                        {kegiatan.tanggal_selesai
                          ? new Date(
                              kegiatan.tanggal_selesai,
                            ).toLocaleDateString("id-ID", options)
                          : "-"}
                      </td>
                      <td className="px-3 py-2 text-xs lg:text-sm font-semibold text-gray-900 capitalize">
                        {kegiatan.tahun}
                      </td>
                      <td className="px-3 py-2 text-xs lg:text-sm font-semibold text-gray-900 w-20 capitalize">
                        {kegiatan.tim}
                      </td>
                      <td className="px-3 py-2 text-xs lg:text-sm font-semibold text-gray-900 flex-1 capitalize">
                        {kegiatan.nama_survei}
                      </td>
                      <td className="px-3 py-2 text-xs lg:text-sm font-semibold text-gray-900 flex-1 capitalize">
                        {kegiatan?.jenis_kegiatan
                          ? convertTypeKegiatan(kegiatan.jenis_kegiatan)
                          : "-"}
                      </td>
                      <td className="px-3 py-2 text-center w-12">
                        <button className="inline-flex items-center justify-center p-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors">
                          {expandedRows.includes(kegiatan.id) ? (
                            <ChevronUp size={16} className="text-gray-600" />
                          ) : (
                            <ChevronDown size={16} className="text-gray-600" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedRows.includes(kegiatan.id) && (
                      <tr className="border-b border-gray-200">
                        <td colSpan={10} className="p-4">
                          {success && showAlert && (
                            <Alert
                              onClose={handleClose}
                              variant="filled"
                              severity="success"
                              className="w-fit bottom-20 right-4 fixed z-50"
                            >
                              Update Berhasil! Data petugas telah diperbarui.
                            </Alert>
                          )}
                          {error && showAlert && (
                            <Alert
                              onClose={handleClose}
                              variant="filled"
                              severity="error"
                              className="w-fit bottom-4 right-4 fixed z-50"
                            >
                              {error}
                            </Alert>
                          )}
                          {Array.isArray(kegiatan.mitra) &&
                          kegiatan.mitra?.length > 0 ? (
                            <div
                              ref={dataMitraRef}
                              className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm"
                            >
                              <table className="min-w-full w-full divide-y divide-gray-200">
                                <thead className="bg-blue-600 text-white">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs lg:text-sm font-semibold">
                                      No
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs lg:text-sm font-semibold">
                                      No Urut Mitra
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs lg:text-sm font-semibold">
                                      Nama Mitra
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs lg:text-sm font-semibold">
                                      Jenis Kelamin
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs lg:text-sm font-semibold">
                                      Kecamatan
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs lg:text-sm font-semibold">
                                      ID Sobat
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs lg:text-sm font-semibold">
                                      Satuan Alokasi
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs lg:text-sm font-semibold">
                                      Alokasi
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs lg:text-sm font-semibold">
                                      Harga per Satuan
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs lg:text-sm font-semibold">
                                      Jumlah
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs lg:text-sm font-semibold">
                                      No. Kontrak SPK
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs lg:text-sm font-semibold">
                                      No. Kontrak BAST
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs lg:text-sm font-semibold">
                                      Aksi
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {kegiatan.mitra.map((pcl, index) => (
                                    <tr
                                      key={index}
                                      className="hover:bg-blue-50 transition-colors"
                                    >
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900">
                                        {index + 1}.
                                      </td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900">
                                        {pcl.no_urut_mitra}
                                      </td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900">
                                        {pcl.nama_petugas}
                                      </td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900">
                                        {pcl.mitra.jenisKelamin
                                          ? convertGender(
                                              pcl.mitra.jenisKelamin,
                                            )
                                          : "-"}
                                      </td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900">
                                        {pcl.kecamatan ? pcl.kecamatan : "-"}
                                      </td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900">
                                        {pcl.id_sobat}
                                      </td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900">
                                        {pcl.satuan}
                                      </td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900 text-center">
                                        {pcl.volum}
                                      </td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-mono font-semibold text-gray-900 text-center">
                                        {new Intl.NumberFormat("id-ID").format(
                                          pcl.harga_per_satuan,
                                        )}
                                      </td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-mono font-semibold text-gray-900 text-center">
                                        {new Intl.NumberFormat("id-ID").format(
                                          pcl.jumlah,
                                        )}
                                      </td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900">
                                        {pcl.no_kontrak_spk
                                          ? pcl.no_kontrak_spk
                                          : "-"}
                                      </td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900">
                                        {pcl.no_kontrak_bast
                                          ? pcl.no_kontrak_bast
                                          : "-"}
                                      </td>
                                      <td className="px-4 py-2">
                                        <div className="flex justify-center gap-2">
                                          {/* TOMBOL HAPUS */}
                                          <Tooltip
                                            title="Hapus Data Mitra"
                                            arrow
                                            placement="top"
                                          >
                                            <Button
                                              onClick={() =>
                                                handleOpenDialog(
                                                  "mitra",
                                                  pcl.id,
                                                )
                                              }
                                              variant="destructive"
                                              size="icon" // Pakai size icon biar bulat/kotak pas
                                              className="h-8 w-8"
                                            >
                                              <Trash2 size={16} />
                                            </Button>
                                          </Tooltip>

                                          {/* TOMBOL EDIT */}
                                          <Tooltip
                                            title="Edit Data Mitra"
                                            arrow
                                            placement="top"
                                          >
                                            <Button
                                              onClick={() => {
                                                toggleRowInput(kegiatan.id);
                                                handleEditKegiatan(pcl);
                                              }}
                                              variant="outline"
                                              size="icon"
                                              className="h-8 w-8 border-blue-200 text-blue-600 hover:bg-blue-50"
                                            >
                                              <Edit3 size={16} />
                                            </Button>
                                          </Tooltip>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-gray-400 italic">
                              Tidak ada data petugas
                            </div>
                          )}

                          <AlertDialog
                            open={open}
                            title="Konfirmasi Hapus"
                            content="Apakah Anda yakin ingin menghapus data ini?"
                            handleClose={() => setOpen(false)}
                            handleConfirm={handleConfirmDelete}
                          />

                          <div
                            ref={formRef}
                            className="flex items-center gap-4 pt-4"
                          >
                            <div
                              onClick={() =>
                                handleOpenDialog("kegiatan", kegiatan.id)
                              }
                              className="w-fit flex items-center gap-2 cursor-pointer hover:text-blue-700 transition-colors text-blue-600 text-xs font-semibold"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                fill="currentColor"
                                className="bi bi-trash"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                              </svg>
                              Hapus Kegiatan
                            </div>
                            <div
                              onClick={() => toggleRowInput(kegiatan.id)}
                              className="w-fit flex items-center gap-2 cursor-pointer hover:text-blue-700 transition-colors text-blue-600 text-xs font-semibold"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                fill="currentColor"
                                className="bi bi-plus-circle-dotted"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                              </svg>
                              Tambah Mitra
                            </div>
                          </div>

                          {expandedInputRows.includes(kegiatan.id) && (
                            <form
                              onSubmit={(e) => handleFormSubmit(e, kegiatan)}
                              method="POST"
                              className="bg-blue-50 my-4 py-4 px-6 border border-blue-200 rounded-lg shadow-sm"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                }
                              }}
                            >
                              <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                {/* Bagian 1: Identitas Utama */}
                                <div className="border-b border-gray-100 pb-4">
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    Informasi Petugas & Peran
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    Pilih mitra dan tentukan peran tugasnya
                                    dalam kegiatan ini.
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  {/* Input Nama Mitra dengan ComboBox */}
                                  <div className="flex flex-col">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                      Nama Lengkap{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <ComboBox
                                      data={mitraData}
                                      labelKey={["sobatId", "namaLengkap"]}
                                      valueKey="sobatId"
                                      value={formData.id_sobat}
                                      placeholder="Cari Id Sobat atau Nama Mitra..."
                                      onChange={(mitra) =>
                                        setFormData((prev) => ({
                                          ...prev,
                                          id_sobat: mitra.sobatId,
                                          nama_petugas: mitra.namaLengkap, // Sinkronkan nama jika perlu
                                        }))
                                      }
                                    />
                                  </div>

                                  {/* No Urut Mitra */}
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                      No. Urut Mitra{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                      type="number"
                                      name="no_urut_mitra"
                                      value={formData.no_urut_mitra}
                                      onChange={handleInputChange}
                                      placeholder="0"
                                      className="text-right font-mono"
                                    />
                                  </div>

                                  {/* Input Peran Tugas */}
                                  <div className="flex flex-col">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                      Posisi/Peran{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                      name="pcl_pml_olah"
                                      value={formData.pcl_pml_olah}
                                      onChange={handleInputChange}
                                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition duration-200 
                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white outline-none"
                                    >
                                      <option value="" disabled>
                                        Pilih Peran Tugas
                                      </option>
                                      <option value="PCL">PCL (Pendata)</option>
                                      <option value="PML">
                                        PML (Pengawas)
                                      </option>
                                      <option value="Pengolah">
                                        PENGOLAH (Editor/Entry)
                                      </option>
                                    </select>
                                  </div>
                                </div>

                                {/* Bagian 2: Rincian Alokasi & Anggaran */}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  {/* Satuan */}
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                      Satuan Alokasi
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                      type="text"
                                      name="satuan"
                                      value={formData.satuan}
                                      onChange={handleInputChange}
                                      placeholder="Contoh: Dokumen, SLS, Desa"
                                      className="hover:border-indigo-300"
                                    />
                                  </div>

                                  {/* Volume */}
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                      Volume / Alokasi{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                      type="number"
                                      name="volum"
                                      value={formData.volum}
                                      onChange={handleInputChange}
                                      placeholder="0"
                                      className="text-right font-mono"
                                    />
                                  </div>

                                  {/* Harga Satuan */}
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                      Harga Per Satuan{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                      <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-medium">
                                        Rp
                                      </span>
                                      <Input
                                        type="number"
                                        name="harga_per_satuan"
                                        value={formData.harga_per_satuan}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="pl-10 text-right font-mono text-indigo-600 font-semibold"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Bagian 3: Detail Tambahan & Kontrak */}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Kecamatan */}
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                      Kecamatan{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                      type="text"
                                      name="kecamatan"
                                      value={formData.kecamatan}
                                      onChange={handleInputChange}
                                      placeholder="Masukkan nama kecamatan"
                                    />
                                  </div>

                                  {/* No Kontrak SPK */}
                                  <div className="flex flex-col">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                      No. Kontrak SPK{" "}
                                      <span className="text-gray-400 font-normal text-xs ml-1">
                                        (Opsional)
                                      </span>
                                    </label>
                                    <Input
                                      type="text"
                                      name="no_kontrak_spk"
                                      value={formData.no_kontrak_spk}
                                      onChange={handleInputChange}
                                      placeholder="Contoh: 001/SPK/2026"
                                      className="px-4 py-2.5 rounded-lg border border-gray-300 font-mono text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                                    />
                                  </div>

                                  {/* No Kontrak BAST */}
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                      No. Kontrak BAST{" "}
                                      <span className="text-gray-400 font-normal text-xs ml-1">
                                        (Opsional)
                                      </span>
                                    </label>
                                    <Input
                                      type="text"
                                      name="no_kontrak_bast"
                                      value={formData.no_kontrak_bast}
                                      onChange={handleInputChange}
                                      placeholder="Contoh: 001/BAST/2025"
                                      className="font-mono text-sm"
                                    />
                                  </div>
                                </div>

                                {/* Summary Otomatis (Optional) */}
                                <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex justify-between items-center">
                                  <span className="text-sm font-medium text-indigo-800">
                                    Estimasi Total Honor:
                                  </span>
                                  <span className="text-xl font-bold text-indigo-900">
                                    Rp{" "}
                                    {(
                                      Number(formData.volum) *
                                      Number(formData.harga_per_satuan)
                                    ).toLocaleString("id-ID")}
                                  </span>
                                </div>
                              </div>
                              <div className="flex pt-2 justify-end">
                                <Button
                                  type="submit"
                                  variant="destructive"
                                  size="sxl"
                                >
                                  Simpan
                                </Button>
                              </div>
                            </form>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )
            ) : (
              <>
                <tr>
                  <td
                    colSpan={9}
                    className="py-6 text-center text-gray-500 italic"
                  >
                    Tidak ada data kegiatan tahun {currentYear}.
                    <span className="pl-1 text-center text-gray-500 italic">
                      Silahkan tambah kegiatan baru.
                    </span>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-600">
            Menampilkan{" "}
            <span className="font-semibold">
              {indexOfFirstRow + 1}-
              {Math.min(indexOfLastRow, kegiatanMitra?.length)}
            </span>{" "}
            dari <span className="font-semibold">{kegiatanMitra?.length}</span>{" "}
            data
          </p>

          <div className="flex items-center gap-2">
            {/* Prev button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={14} />
              Prev
            </button>

            {/* Page numbers with ellipsis */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 5) return true; // kalau total page <= 5, tampilkan semua
                if (page === 1 || page === totalPages) return true; // halaman pertama & terakhir selalu tampil
                if (page >= currentPage - 1 && page <= currentPage + 1)
                  return true; // tampilkan sekitar currentPage
                return false;
              })
              .map((page, idx, arr) => {
                const prevPage = arr[idx - 1];
                const showEllipsis = prevPage && page - prevPage > 1;

                return (
                  <React.Fragment key={page}>
                    {showEllipsis && (
                      <span className="px-2 text-gray-400 text-xs">...</span>
                    )}
                    <button
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            {/* Next button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <Link to="/add-kegiatan">
          <button className="fixed bottom-4 right-4 p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform transition-transform hover:scale-110">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </Link>
      </div>

      {/* 👇 PASTE TEMPLATE PDF MASSAL DI SINI (Di luar tabel & pagination) 👇 */}
      {/* ===== TEMPLATE HTML TO PDF MASSAL (HIDDEN) ===== */}
      {bulkPdfData.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "-9999px", // Sembunyikan dengan membuang ke kiri agar kamera tidak blank
            width: "794px",
          }}
        >
          {bulkPdfData.map((dataItem, idx) => {
            const {
              dataMitra: mData,
              rincianTable: mRincian,
              totalHonor: mTotal,
              htmlId,
            } = dataItem;

            const kPertama =
              mRincian && mRincian.length > 0 ? mRincian[0] : null;

            const jenisKegiatan =
              convertTypeKegiatan(kPertama?.kegiatan) || "Pendataan Lapangan";
            const noKontrakSPK =
              kPertama?.no_kontrak_spk || "...................";
            const kecamatanMitra = kPertama?.kecamatan || "...................";

            // Hitung Tanggal
            const tglMulaiNum = kPertama?.tanggal_mulai
              ? new Date(kPertama.tanggal_mulai).getDate()
              : 1;
            const bulIndex = months.findIndex(
              (b) => b.toLowerCase() === selectedMonth.toLowerCase(),
            );
            const tglTerakhirNum = new Date(
              Number(selectedYear),
              bulIndex + 1,
              0,
            ).getDate();

            const tglTTDObj = getTanggalTTD(
              selectedMonth,
              Number(selectedYear),
            );
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

            const hariTTD = tglTTDObj ? hariList[tglTTDObj.getDay()] : "";
            const tglTTDTerbilang = tglTTDObj
              ? terbilang(tglTTDObj.getDate()).trim()
              : "";
            const bulanTTD = tglTTDObj
              ? bulanList[tglTTDObj.getMonth()]
              : selectedMonth;
            const tahunTTDTerbilang = tglTTDObj
              ? terbilang(tglTTDObj.getFullYear()).trim()
              : terbilang(Number(selectedYear)).trim();

            const totalRupiahTerbilang = mTotal
              ? terbilang(mTotal).trim() + " Rupiah"
              : "-";

            return (
              <div
                key={idx}
                id={htmlId}
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
                      {bulanTTD} tahun {tahunTTDTerbilang} bertempat di
                      Kabupaten Bojonegoro, yang bertanda tangan di bawah ini:
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
                          Pejabat Pembuat Komitmen Badan Pusat Statistik
                          Kabupaten Bojonegoro, berkedudukan di Bojonegoro,
                          bertindak untuk dan atas nama Badan Pusat Statistik
                          Jl. Sawunggaling No.62, Ngrowo, Kabupaten, Kec.
                          Bojonegoro, Kabupaten Bojonegoro, selanjutnya disebut
                          sebagai <strong>PIHAK PERTAMA</strong>.
                        </td>
                      </tr>
                      <tr>
                        <td className="align-top">(2) {mData?.namaLengkap}</td>
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
                      <strong>PIHAK KEDUA</strong> yang secara bersama-sama
                      disebut <strong>PARA PIHAK</strong>, sepakat untuk
                      mengikatkan diri dalam Perjanjian Kerja Petugas{" "}
                      {jenisKegiatan} pada Badan Pusat Statistik Kabupaten
                      Bojonegoro Nomor: {noKontrakSPK}, yang selanjutnya disebut
                      Perjanjian, dengan ketentuan-ketentuan sebagai berikut:
                    </p>
                  </div>
                </div>

                {/* PASAL 1 */}
                <div style={{ pageBreakInside: "avoid" }}>
                  <div className="text-center font-bold mt-6 mb-2">Pasal 1</div>
                  <p className="text-justify mb-4">
                    <strong>PIHAK PERTAMA</strong> memberikan pekerjaan kepada{" "}
                    <strong>PIHAK KEDUA</strong> dan{" "}
                    <strong>PIHAK KEDUA</strong> menerima pekerjaan dari{" "}
                    <strong>PIHAK PERTAMA</strong> sebagai Petugas{" "}
                    {jenisKegiatan} pada Badan Pusat Statistik Kabupaten
                    Bojonegoro, dengan lingkup pekerjaan yang ditetapkan oleh{" "}
                    <strong>PIHAK PERTAMA</strong>.
                  </p>
                </div>

                {/* PASAL 2 */}
                <div style={{ pageBreakInside: "avoid" }}>
                  <div className="text-center font-bold mt-6 mb-2">Pasal 2</div>
                  <p className="text-justify mb-4">
                    Ruang lingkup pekerjaan dalam Perjanjian ini mengacu pada
                    wilayah kerja dan beban kerja sebagaimana tertuang dalam
                    lampiran Perjanjian, dan ketentuan-ketentuan lainnya yang
                    ditetapkan oleh <strong>PIHAK PERTAMA</strong>.
                  </p>
                </div>

                {/* PASAL 3 */}
                <div style={{ pageBreakInside: "avoid" }}>
                  <div className="text-center font-bold mt-6 mb-2">Pasal 3</div>
                  <p className="text-justify mb-4">
                    Jangka waktu Perjanjian ini terhitung sejak {tglMulaiNum}{" "}
                    {selectedMonth} {selectedYear} sampai dengan{" "}
                    {tglTerakhirNum} {selectedMonth} {selectedYear}.
                  </p>
                </div>

                {/* PASAL 4 */}

                <div style={{ pageBreakInside: "avoid" }}>
                  <div className="text-center text-black-500 mt-6 mb-2">2</div>
                  <div className="text-center font-bold mt-2 mb-2">Pasal 4</div>
                  <ol className="text-justify mb-4 list-decimal pl-5">
                    <li className="pl-1 mb-1">
                      <strong>PIHAK KEDUA</strong> berkewajiban menyelesaikan
                      pekerjaan yang diberikan oleh{" "}
                      <strong>PIHAK PERTAMA</strong> sesuai ruang lingkup
                      pekerjaan sebagaimana dimaksud dalam Pasal 2.
                    </li>
                    <li className="pl-1">
                      <strong>PIHAK KEDUA</strong> untuk waktu yang tidak
                      terbatas dan/atau tidak terikat kepada masa berlakunya
                      Perjanjian ini, menjamin untuk memberlakukan sebagai
                      rahasia setiap data/informasi yang diterima atau
                      diperolehnya dari <strong>PIHAK PERTAMA</strong>, serta
                      menjamin bahwa keterangan demikian hanya dipergunakan
                      untuk melaksanakan tujuan menurut Perjanjian ini.
                    </li>
                  </ol>
                </div>

                {/* PASAL 5 */}
                <div style={{ pageBreakInside: "avoid" }}>
                  <div className="text-center font-bold mt-6 mb-2">Pasal 5</div>
                  <ol className="text-justify mb-4 list-none">
                    <li className="mb-1">
                      (1) <strong>PIHAK KEDUA</strong> apabila melakukan
                      peminjaman dokumen/data/aset milik{" "}
                      <strong>PIHAK PERTAMA</strong>, wajib menjaga dan
                      menggunakan sesuai dengan tujuan perjanjian dan
                      mengembalikan dalam keadaan utuh sama dengan saat
                      peminjaman, serta dilarang menggandakan, menyalin,
                      menunjukkan, dan/atau mendokumentasikan dalam bentuk foto
                      atau bentuk apapun untuk kepentingan pribadi ataupun
                      kepentingan lain yang tidak berkaitan dengan tujuan
                      perjanjian ini.
                    </li>
                    <li>
                      (2) <strong>PIHAK KEDUA</strong> dilarang memberikan
                      dokumen/data/aset milik <strong>PIHAK PERTAMA</strong>{" "}
                      yang berada dalam penguasaan <strong>PIHAK KEDUA</strong>,
                      baik secara langsung maupun tidak langsung, termasuk
                      memberikan akses kepada pihak lain untuk menggunakan,
                      menyalin, memfotokopi, menunjukkan, dan/atau
                      mendokumentasikan dalam bentuk foto atau bentuk apapun,
                      sehingga informasi diketahui oleh pihak lain untuk tujuan
                      apapun.
                    </li>
                  </ol>
                </div>

                {/* PASAL 6 */}
                <div style={{ pageBreakInside: "avoid" }}>
                  <div className="text-center font-bold mt-6 mb-2">Pasal 6</div>
                  <ol className="text-justify mb-4 list-none">
                    <li className="mb-1">
                      (1) <strong>PIHAK KEDUA</strong> berhak untuk mendapatkan
                      honorarium dari <strong>PIHAK PERTAMA</strong> sesuai
                      ketentuan yang berlaku dan anggaran yang tersedia untuk
                      pekerjaan sebagaimana dimaksud dalam Pasal 2, termasuk
                      biaya pajak dan bea meterai.
                    </li>
                    <li>
                      (2) Honorarium sebagaimana dimaksud pada ayat (1)
                      dibayarkan oleh <strong>PIHAK PERTAMA</strong> kepada{" "}
                      <strong>PIHAK KEDUA</strong> setelah menyelesaikan seluruh
                      pekerjaan yang ditargetkan sebagaimana tercantum dalam
                      Lampiran Perjanjian, dituangkan dalam Berita Acara Serah
                      Terima Hasil Pekerjaan.
                    </li>
                  </ol>
                </div>

                {/* PASAL 7 */}
                <div style={{ pageBreakInside: "avoid" }}>
                  <div className="text-center font-bold mt-6 mb-2">Pasal 7</div>
                  <ol className="text-justify mb-4 list-none">
                    <li className="mb-1">
                      (1) Pembayaran honorarium sebagaimana dimaksud dalam Pasal
                      6, dilakukan setelah <strong>PIHAK KEDUA</strong>{" "}
                      menyelesaikan dan menyerahkan hasil pekerjaan sesuai
                      dengan kegiatan pekerjaan yang dilakukan sebagaimana
                      dimaksud dalam Pasal 2 kepada{" "}
                      <strong>PIHAK PERTAMA</strong>.
                    </li>
                    <li>
                      (2) Pembayaran sebagaimana dimaksud pada ayat (1)
                      dilakukan oleh <strong>PIHAK PERTAMA</strong> kepada{" "}
                      <strong>PIHAK KEDUA</strong> sesuai dengan ketentuan
                      peraturan perundang-undangan.
                    </li>
                  </ol>
                </div>

                {/* PASAL 8 */}
                <div style={{ pageBreakInside: "avoid" }}>
                  <div className="text-center text-black-500 mt-6 mb-2">3</div>
                  <div className="text-center font-bold mt-2 mb-2">Pasal 8</div>
                  <ol className="text-justify mb-4 list-[lower-alpha] pl-5">
                    <li className="pl-1 mb-1">
                      <strong>PIHAK PERTAMA</strong> secara berjenjang melakukan
                      pemeriksaan dan evaluasi atas target penyelesaian dan
                      kualitas hasil pekerjaan yang dilaksanakan oleh{" "}
                      <strong>PIHAK KEDUA</strong>.
                    </li>
                    <li className="pl-1">
                      Hasil pemeriksaan dan evaluasi sebagaimana dimaksud pada
                      ayat (1) menjadi dasar pembayaran honorarium{" "}
                      <strong>PIHAK KEDUA</strong> oleh{" "}
                      <strong>PIHAK PERTAMA</strong> sebagaimana dimaksud dalam
                      Pasal 6 ayat (2), yang dituangkan dalam Berita Acara Serah
                      Terima Hasil Pekerjaan yang ditandatangani oleh{" "}
                      <strong>PARA PIHAK</strong>.
                    </li>
                  </ol>
                </div>

                {/* PASAL 9 */}
                <div style={{ pageBreakInside: "avoid" }}>
                  <div className="text-center font-bold mt-6 mb-2">Pasal 9</div>
                  <p className="text-justify mb-4">
                    <strong>PIHAK PERTAMA</strong> dapat memutuskan Perjanjian
                    ini secara sepihak sewaktu-waktu dalam hal{" "}
                    <strong>PIHAK KEDUA</strong> tidak dapat melaksanakan
                    kewajibannya sebagaimana dimaksud dalam Pasal 4 dengan
                    menerbitkan Surat Pemutusan Perjanjian Kerja.
                  </p>
                </div>

                {/* PASAL 10 */}
                <div style={{ pageBreakInside: "avoid" }}>
                  <div className="text-center font-bold mt-6 mb-2">
                    Pasal 10
                  </div>
                  <ol className="text-justify mb-4 list-none">
                    <li className="mb-1">
                      (1) Apabila <strong>PIHAK KEDUA</strong> mengundurkan diri
                      dengan tidak menyelesaikan pekerjaan sebagaimana dimaksud
                      dalam Pasal 2, maka akan diberikan sanksi oleh{" "}
                      <strong>PIHAK PERTAMA</strong>, sebagai berikut:
                      <ol className="list-none pl-6 mt-1">
                        <li className="mb-1">
                          (1) mengundurkan diri setelah pelatihan dan belum
                          mengikuti kegiatan diberikan sanksi sebesar biaya
                          pelatihan.
                        </li>
                        <li>
                          (2) mengundurkan diri pada saat pelaksanaan pekerjaan,
                          diberikan sanksi tidak diberikan honorarium atas
                          pekerjaan yang telah dilaksanakan.
                        </li>
                      </ol>
                    </li>
                    <li className="mb-1">
                      (2) Dikecualikan tidak dikenakan sanksi sebagaimana
                      dimaksud pada ayat (1) oleh <strong>PIHAK PERTAMA</strong>
                      , apabila <strong>PIHAK KEDUA</strong> meninggal dunia,
                      mengundurkan diri karena sakit dengan keterangan rawat
                      inap, kecelakaan dengan keterangan kepolisian, dan/atau
                      telah diberikan Surat Pemutusan Perjanjian Kerja dari{" "}
                      <strong>PIHAK PERTAMA</strong>.
                    </li>
                    <li>
                      (3) Dalam hal terjadi peristiwa sebagaimana dimaksud pada
                      ayat (2), <strong>PIHAK PERTAMA</strong> membayarkan
                      honorarium kepada <strong>PIHAK KEDUA</strong> secara
                      proporsional sesuai pekerjaan yang telah dilaksanakan.
                    </li>
                  </ol>
                </div>

                {/* PASAL 11 */}
                <div style={{ pageBreakInside: "avoid" }}>
                  <div className="text-center font-bold mt-6 mb-2">
                    Pasal 11
                  </div>
                  <ol className="text-justify mb-4 list-none">
                    <li className="mb-1">
                      (1) Apabila terjadi Keadaan Kahar, yang meliputi bencana
                      alam, bencana nonalam, dan bencana sosial,{" "}
                      <strong>PIHAK KEDUA</strong> memberitahukan kepada{" "}
                      <strong>PIHAK PERTAMA</strong> dalam waktu paling lambat
                      14 (empat belas) hari sejak mengetahui atas kejadian
                      Keadaan Kahar dengan menyertakan bukti.
                    </li>
                    <li className="mb-1">
                      (2) Dalam hal terjadi peristiwa sebagaimana dimaksud pada
                      ayat (1) pelaksanaan pekerjaan oleh{" "}
                      <strong>PIHAK KEDUA</strong> dihentikan sementara dan
                      dilanjutkan kembali setelah Keadaan Kahar berakhir,
                      merujuk pada ketentuan yang ditetapkan oleh{" "}
                      <strong>PIHAK PERTAMA</strong>.
                    </li>
                  </ol>
                </div>

                {/* LANJUTAN PASAL 11 & PASAL 12 */}
                <div style={{ pageBreakInside: "avoid" }}>
                  <div className="text-center text-black-500 mt-6 mb-6">4</div>

                  {/* Lanjutan Pasal 11 Ayat 3 */}
                  <ol className="text-justify mb-4 list-none">
                    <li>
                      (3) Apabila akibat Keadaan Kahar tidak memungkinkan
                      dilanjutkan/diselesaikannya pelaksanaan pekerjaan,{" "}
                      <strong>PIHAK KEDUA</strong> berhak menerima honorarium
                      secara proporsional sesuai pekerjaan yang telah
                      diselesaikan dan diterima oleh{" "}
                      <strong>PIHAK PERTAMA</strong>.
                    </li>
                  </ol>

                  {/* Pasal 12 */}
                  <div className="text-center font-bold mt-6 mb-2">
                    Pasal 12
                  </div>
                  <p className="text-justify mb-4">
                    Hal-hal yang belum diatur dalam Perjanjian ini atau segala
                    perubahan terhadap Perjanjian ini diatur lebih lanjut oleh{" "}
                    <strong>PARA PIHAK</strong> dalam perjanjian
                    tambahan/adendum dan merupakan bagian tidak terpisahkan dari
                    Perjanjian ini.
                  </p>
                </div>

                {/* PASAL 13 */}
                <div style={{ pageBreakInside: "avoid" }}>
                  <div className="text-center font-bold mt-6 mb-2">
                    Pasal 13
                  </div>
                  <ol className="text-justify mb-4 list-none">
                    <li className="mb-1">
                      (1) Segala perselisihan atau perbedaan pendapat yang
                      mungkin timbul sebagai akibat dari Perjanjian ini,
                      diselesaikan secara musyawarah untuk mufakat oleh{" "}
                      <strong>PARA PIHAK</strong>.
                    </li>
                    <li className="mb-1">
                      (2) Apabila musyawarah untuk mufakat sebagaimana dimaksud
                      pada ayat (1) tidak berhasil, maka{" "}
                      <strong>PARA PIHAK</strong> sepakat untuk menyelesaikan
                      perselisihan dengan memilih kedudukan/domisili hukum di
                      Kepaniteraan Pengadilan Negeri Kabupaten Bojonegoro.
                    </li>
                    <li>
                      (3) Selama perselisihan dalam proses penyelesaian
                      pengadilan, <strong>PIHAK PERTAMA</strong> dan{" "}
                      <strong>PIHAK KEDUA</strong> wajib tetap melaksanakan
                      kewajiban masing-masing berdasarkan Perjanjian ini.
                    </li>
                  </ol>
                </div>

                {/* PENUTUP & TTD */}
                <div style={{ pageBreakInside: "avoid" }}>
                  <p className="text-justify mt-8 mb-16">
                    Demikian Perjanjian ini dibuat dan ditandatangani oleh{" "}
                    <strong>PARA PIHAK</strong> dalam 2 (dua) rangkap asli
                    bermeterai cukup, tanpa paksaan dari PIHAK manapun dan untuk
                    dilaksanakan oleh <strong>PARA PIHAK</strong>.
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
                            {mData?.namaLengkap}
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
                    DAFTAR URAIAN TUGAS, JANGKA WAKTU, TARGET PEKERJAAN DAN
                    NILAI PERJANJIAN
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
                      {mRincian?.map((item: any, i: number) => {
                        // --- LOGIKA TANGGAL HARI KERJA PERTAMA KHUSUS MASSAL ---
                        let tglMulaiKerjaNum = 1;
                        if (bulIndex !== -1) {
                          const tglCek = new Date(
                            Number(selectedYear),
                            bulIndex,
                            1,
                          );
                          // Geser jika jatuh di Sabtu (6) atau Minggu (0)
                          while (
                            tglCek.getDay() === 0 ||
                            tglCek.getDay() === 6
                          ) {
                            tglCek.setDate(tglCek.getDate() + 1);
                          }
                          tglMulaiKerjaNum = tglCek.getDate();
                        }

                        // Cek apakah item punya tanggal lapangan custom ber-strip (misal: "15-20")
                        const tglLapanganStr = String(
                          item.tanggal || "",
                        ).trim();
                        let tglRender = "";

                        if (tglLapanganStr.includes("-")) {
                          const [start, end] = tglLapanganStr.split("-");
                          tglRender = `${start.trim()} s.d ${end.trim()} ${selectedMonth} ${selectedYear}`;
                        } else {
                          // Jika dari DB ada tanggal_selesai spesifik, gunakan. Jika tidak, gunakan akhir bulan.
                          const tglSelesaiNum = item.tanggal_selesai
                            ? new Date(item.tanggal_selesai).getDate()
                            : tglTerakhirNum;

                          tglRender = `${tglMulaiKerjaNum} s.d ${tglSelesaiNum} ${selectedMonth} ${selectedYear}`;
                        }

                        return (
                          <tr key={i}>
                            <td className="border border-black p-3 text-left">
                              {i + 1}. {item.kegiatan} {item.nama_survei}
                            </td>
                            <td className="border border-black p-3">
                              {tglRender}
                            </td>
                            <td className="border border-black p-3">
                              {item.volum}
                            </td>
                            <td className="border border-black p-3">
                              {item.satuan}
                            </td>
                            <td className="border border-black p-3 text-right">
                              {new Intl.NumberFormat("id-ID").format(
                                item.jumlah || 0,
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td
                          colSpan={4}
                          className="border border-black p-3 text-left italic"
                        >
                          <strong>Terbilang:</strong> {totalRupiahTerbilang}
                        </td>
                        <td className="border border-black p-3 font-bold text-right bg-gray-50 whitespace-nowrap">
                          Rp{" "}
                          {new Intl.NumberFormat("id-ID").format(mTotal || 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
