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
import { Input } from '@components/ui/input'
import { Link } from "react-router-dom";
import ComboBox from "@/components/combobox";
import Skeleton from 'react-loading-skeleton'
import { KegiatanMitraResponse } from "@/interfaces/types";
import useUserApi from "@/lib/userApi";
import useKegiatanMitraApi from "@/lib/kegaiatanMitraApi";
import { months } from '../../constants'
import useKegiatanApi from "@/lib/kegiatanApi";
import { AlertDialog } from "@/components/alertdialog";
import filterApi from "@/lib/filterApi";
import { Alert, Tooltip } from "@mui/material";


export default function HonorBulanan() {
  const [kegiatanMitra, setKegiatanMitra] = useState<KegiatanMitraResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [expandedInputRows, setExpandedInputRows] = useState<number[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const [years, setYears] = useState<any[]>([]);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(Number(currentYear).toString());
  const { getTahun } = filterApi();

  const [tim, setTim] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const { getAllUsers } = useUserApi();
  const { deleteKegiatan } = useKegiatanApi();
  const { editKegiatanMitra, getKegiatanMitra, createKegiatanMitra, deleteKegiatanMitra } = useKegiatanMitraApi();
  const [formData, setFormData] = useState({
    id: "",
    volum: "",
    harga_per_satuan: "",
    id_sobat: "",
    pcl_pml_olah: '',
    satuan: '',
    kecamatan: '',
    no_kontrak_spk: '',
    no_kontrak_bast: '',
    no_urut_mitra: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  const totalPages = Math.ceil(kegiatanMitra?.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = kegiatanMitra?.slice(indexOfFirstRow, indexOfLastRow);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
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
      prev.includes(id) ? prev?.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleRowInput = (id: number) => {
    clear()
    setExpandedInputRows((prev) =>
      prev.includes(id) ? prev?.filter((rowId) => rowId !== id) : [...prev, id]
    );
  }

  const toggleSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev?.filter((row) => row !== id) : [...prev, id]
    );
  };


  async function fetchData(selectedYear, selectedMonth, tim) {
    setIsLoading(true);
    Promise.all([
      getKegiatanMitra(selectedYear, selectedMonth, tim),
      await getAllUsers()
    ])
      .then(([kegMitra, users]) => {
        setKegiatanMitra(kegMitra);
        setMitraData(users.map(user => ({
          id: user.id,
          namaLengkap: user.namaLengkap,
          sobatId: user.sobatId,
        })));
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }

  async function fetchTahun() {
    getTahun().then((res) => {
      setYears(res);
    })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    fetchData(selectedYear, selectedMonth, tim);
    fetchTahun()
  }, [selectedYear, selectedMonth, tim]);


  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
  };

  function clear() {
    setFormData({
      id: "",
      volum: "",
      harga_per_satuan: "",
      id_sobat: '',
      pcl_pml_olah: '',
      satuan: '',
      kecamatan: '',
      no_kontrak_spk: '',
      no_kontrak_bast: '',
      no_urut_mitra: ''
    })
  }

  async function handleFormSubmit(event, kegiatan) {
    event.preventDefault();
    console.log(formData)

    if (formData.id) {
      const payload = {
        ...formData,
        jumlah: Number(formData.harga_per_satuan) * Number(formData.volum)
      };
      editKegiatanMitra(payload)
        .then(() => {
          fetchData(selectedYear, selectedMonth, tim);
          clear()
          setSuccess("Update Berhasil! Data petugas telah diperbarui.")
          setTimeout(() => {
            dataMitraRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }, 100);
        })
        .catch((err) => { setError(err) })
        .finally(() => { setIsLoading(false); clear() })
    } else {
      const payload = {
        ...formData,
        kegiatanId: kegiatan.kodeKegiatan,
        jumlah: Number(formData.harga_per_satuan) * Number(formData.volum)
      };
      createKegiatanMitra(payload)
        .then(() => {
          fetchData(selectedYear, selectedMonth, tim);
          clear()
          setSuccess("Berhasil! Data kegiatan baru telah ditambahkan ke sistem.")
        })
        .catch((err) => { setError(err) })
        .finally(() => { setIsLoading(false) })
    }
  }

  async function deleteData(id) {
    setError(null);
    setIsLoading(true)
    console.log(id)
    deleteKegiatanMitra(id)
      .then(() => {
        setKegiatanMitra(prev =>
          prev.map(group => ({
            ...group,
            mitra: group.mitra?.filter(m => m.id !== id)
          }))
        );
      })
      .catch(
        (err) => { console.error("Gagal hapus kegiatan:", err) }
      )
      .finally(() => setIsLoading(false))
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
    setIsLoading(true)
    deleteKegiatan(id)
      .then(() => {
        setKegiatanMitra((prev) =>
          prev.filter((kegiatan) => kegiatan.id !== id)
        );
      })
      .catch((err) => { console.error("Gagal hapus kegiatan:", err) })
      .finally(() => setIsLoading(false))
  }

  const resetFilters = () => {
    setSelectedYear('');
    setSelectedMonth('')
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
    }))

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
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

  return (
    <div className="space-y-4 p-4 bg-gray-50 min-h-screen">
      <div className="w-full bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
        <div className="flex justify-between items-center gap-3">
          <h1 className="text-lg font-bold text-gray-900">Tim Kegiatan</h1>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/upload-template" className="flex gap-2 bg-white">
              <Button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upload" viewBox="0 0 16 16">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                  <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
                </svg>
                <p>
                  Upload Template
                </p>
              </Button>
            </Link>
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
              <option value={''}>
                Pilih Tahun
              </option>
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
              <option value={''}>
                Pilih Bulan
              </option>
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
              <th className="px-3 py-2 text-left text-xs lg:text-sm font-semibold w-8">No.</th>
              <th className="px-3 py-2 text-left text-xs lg:text-sm font-semibold w-[200px]">Judul</th>
              <th className="px-3 py-2 text-left text-xs lg:text-sm font-semibold w-[200px]">Tanggal Mulai</th>
              <th className="px-3 py-2 text-left text-xs lg:text-sm font-semibold w-[100px]">Bulan</th>
              <th className="px-3 py-2 text-left text-xs lg:text-sm font-semibold w-[200px]">Tanggal Selesai</th>
              <th className="px-3 py-2 text-left text-xs lg:text-sm font-semibold w-[200px]">Tahun</th>
              <th className="px-3 py-2 text-left text-xs lg:text-sm font-semibold w-20">Tim</th>
              <th className="px-3 py-2 text-left text-xs lg:text-sm font-semibold flex-1">Nama Survei</th>
              <th className="px-3 py-2 text-left text-xs lg:text-sm font-semibold flex-1">Jenis Kegiatan</th>
              <th className="px-3 py-2 text-center text-xs lg:text-sm font-semibold w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {Array.isArray(currentRows) && currentRows?.length > 0 ?
              isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-2"><Skeleton height={16} width="70%" /></td>
                    )
                    )}
                  </tr>
                ))
              ) : (
                currentRows.map((kegiatan, index) => (
                  <React.Fragment key={kegiatan.id}>
                    <tr className="border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors" onClick={() => toggleRow(kegiatan.id)} key={index}>
                      <td className="px-3 py-2 text-xs lg:text-sm font-semibold text-gray-900 w-8">{index + 1}.</td>
                      <td className="px-3 py-2 text-xs lg:text-sm font-semibold text-gray-900 uppercase">{kegiatan?.judul ? convertTypeKegiatan(kegiatan.jenis_kegiatan) : '-'}</td>
                      <td className="px-3 py-2 text-xs lg:text-sm font-semibold text-gray-900 capitalize">{kegiatan.tanggal_mulai ? new Date(kegiatan.tanggal_mulai).toLocaleDateString('id-ID', options) : '-'}</td>
                      <td className="px-3 py-2 text-xs lg:text-sm font-semibold text-gray-900 capitalize">{kegiatan.bulan}</td>
                      <td className="px-3 py-2 text-xs lg:text-sm font-semibold text-gray-900 capitalize">{kegiatan.tanggal_selesai ? new Date(kegiatan.tanggal_selesai).toLocaleDateString('id-ID', options) : '-'}</td>
                      <td className="px-3 py-2 text-xs lg:text-sm font-semibold text-gray-900 capitalize">{kegiatan.tahun}</td>
                      <td className="px-3 py-2 text-xs lg:text-sm font-semibold text-gray-900 w-20 capitalize">{kegiatan.tim}</td>
                      <td className="px-3 py-2 text-xs lg:text-sm font-semibold text-gray-900 flex-1 capitalize">{kegiatan.nama_survei}</td>
                      <td className="px-3 py-2 text-xs lg:text-sm font-semibold text-gray-900 flex-1 capitalize">{kegiatan?.jenis_kegiatan ? convertTypeKegiatan(kegiatan.jenis_kegiatan) : '-'}</td>
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
                            <Alert onClose={handleClose} variant="filled" severity="success" className='w-fit bottom-20 right-4 fixed z-50'>
                              Update Berhasil! Data petugas telah diperbarui.
                            </Alert>
                          )}
                          {error && showAlert && (
                            <Alert onClose={handleClose} variant="filled" severity="error" className='w-fit bottom-4 right-4 fixed z-50'>
                              {error}
                            </Alert>
                          )}
                          {Array.isArray(kegiatan.mitra) && kegiatan.mitra?.length > 0 ? (
                            <div ref={dataMitraRef} className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
                              <table className="min-w-full w-full divide-y divide-gray-200">
                                <thead className="bg-blue-600 text-white">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs lg:text-sm font-semibold">No</th>
                                    <th className="px-4 py-2 text-left text-xs lg:text-sm font-semibold">No Urut Mitra</th>
                                    <th className="px-4 py-2 text-left text-xs lg:text-sm font-semibold">Nama Mitra</th>
                                    <th className="px-4 py-2 text-left text-xs lg:text-sm font-semibold">Jenis Kelamin</th>
                                    <th className="px-4 py-2 text-left text-xs lg:text-sm font-semibold">Kecamatan</th>
                                    <th className="px-4 py-2 text-left text-xs lg:text-sm font-semibold">ID Sobat</th>
                                    <th className="px-4 py-2 text-left text-xs lg:text-sm font-semibold">Satuan Alokasi</th>
                                    <th className="px-4 py-2 text-center text-xs lg:text-sm font-semibold">Alokasi</th>
                                    <th className="px-4 py-2 text-center text-xs lg:text-sm font-semibold">Harga per Satuan</th>
                                    <th className="px-4 py-2 text-center text-xs lg:text-sm font-semibold">Jumlah</th>
                                    <th className="px-4 py-2 text-left text-xs lg:text-sm font-semibold">No. Kontrak SPK</th>
                                    <th className="px-4 py-2 text-left text-xs lg:text-sm font-semibold">No. Kontrak BAST</th>
                                    <th className="px-4 py-2 text-center text-xs lg:text-sm font-semibold">Aksi</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {kegiatan.mitra.map((pcl, index) => (
                                    <tr key={index} className="hover:bg-blue-50 transition-colors">
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900">{index + 1}.</td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900">{pcl.no_urut_mitra}</td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900">{pcl.nama_petugas}</td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900">{pcl.mitra.jenisKelamin ? convertGender(pcl.mitra.jenisKelamin) : "-"}</td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900">{pcl.kecamatan ? pcl.kecamatan : "-"}</td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900">{pcl.id_sobat}</td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900">{pcl.satuan}</td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900 text-center">{pcl.volum}</td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-mono font-semibold text-gray-900 text-center">{new Intl.NumberFormat("id-ID").format(pcl.harga_per_satuan)}</td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-mono font-semibold text-gray-900 text-center">
                                        {new Intl.NumberFormat("id-ID").format(pcl.jumlah)}
                                      </td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900">{pcl.no_kontrak_spk ? pcl.no_kontrak_spk : "-"}</td>
                                      <td className="px-4 py-2 text-xs lg:text-sm font-semibold text-gray-900">{pcl.no_kontrak_bast ? pcl.no_kontrak_bast : "-"}</td>
                                      <td className="px-4 py-2">
                                        <div className="flex justify-center gap-2">

                                          {/* TOMBOL HAPUS */}
                                          <Tooltip title="Hapus Data Mitra" arrow placement="top">
                                            <Button
                                              onClick={() => handleOpenDialog("mitra", pcl.id)}
                                              variant="destructive"
                                              size="icon" // Pakai size icon biar bulat/kotak pas
                                              className="h-8 w-8"
                                            >
                                              <Trash2 size={16} />
                                            </Button>
                                          </Tooltip>

                                          {/* TOMBOL EDIT */}
                                          <Tooltip title="Edit Data Mitra" arrow placement="top">
                                            <Button
                                              onClick={() => {
                                                toggleRowInput(kegiatan.id)
                                                handleEditKegiatan(pcl)
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
                            <div className="text-gray-400 italic">Tidak ada data petugas</div>
                          )}

                          <AlertDialog
                            open={open}
                            title="Konfirmasi Hapus"
                            content="Apakah Anda yakin ingin menghapus data ini?"
                            handleClose={() => setOpen(false)}
                            handleConfirm={handleConfirmDelete}
                          />

                          <div ref={formRef} className="flex items-center gap-4 pt-4">
                            <div
                              onClick={() => handleOpenDialog("kegiatan", kegiatan.id)}
                              className="w-fit flex items-center gap-2 cursor-pointer hover:text-blue-700 transition-colors text-blue-600 text-xs font-semibold"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                              </svg>
                              Hapus Kegiatan
                            </div>
                            <div
                              onClick={() => toggleRowInput(kegiatan.id)}
                              className="w-fit flex items-center gap-2 cursor-pointer hover:text-blue-700 transition-colors text-blue-600 text-xs font-semibold"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-plus-circle-dotted" viewBox="0 0 16 16">
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
                                  <h3 className="text-lg font-semibold text-gray-800">Informasi Petugas & Peran</h3>
                                  <p className="text-sm text-gray-500">Pilih mitra dan tentukan peran tugasnya dalam kegiatan ini.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  {/* Input Nama Mitra dengan ComboBox */}
                                  <div className="flex flex-col">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                      Nama Lengkap <span className="text-red-500">*</span>
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
                                      No. Urut Mitra <span className="text-red-500">*</span>
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
                                      Posisi/Peran <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                      name="pcl_pml_olah"
                                      value={formData.pcl_pml_olah}
                                      onChange={handleInputChange}
                                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition duration-200 
                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white outline-none"
                                    >
                                      <option value="" disabled>Pilih Peran Tugas</option>
                                      <option value="PCL">PCL (Pendata)</option>
                                      <option value="PML">PML (Pengawas)</option>
                                      <option value="Pengolah">PENGOLAH (Editor/Entry)</option>
                                    </select>
                                  </div>
                                </div>

                                {/* Bagian 2: Rincian Alokasi & Anggaran */}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  {/* Satuan */}
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                      Satuan Alokasi<span className="text-red-500">*</span>
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
                                      Volume / Alokasi <span className="text-red-500">*</span>
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
                                      Harga Per Satuan <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                      <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-medium">Rp</span>
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
                                      Kecamatan <span className="text-red-500">*</span>
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
                                      No. Kontrak SPK <span className="text-gray-400 font-normal text-xs ml-1">(Opsional)</span>
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
                                      No. Kontrak BAST <span className="text-gray-400 font-normal text-xs ml-1">(Opsional)</span>
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
                                  <span className="text-sm font-medium text-indigo-800">Estimasi Total Honor:</span>
                                  <span className="text-xl font-bold text-indigo-900">
                                    Rp {(Number(formData.volum) * Number(formData.harga_per_satuan)).toLocaleString('id-ID')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex pt-2 justify-end">
                                <Button type="submit" variant="destructive" size="sxl">
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
              ) : (
                <>
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-gray-500 italic">Tidak ada data kegiatan tahun {currentYear}.
                      <span className="pl-1 text-center text-gray-500 italic">Silahkan tambah kegiatan baru.</span></td>
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
              {indexOfFirstRow + 1}-{Math.min(indexOfLastRow, kegiatanMitra?.length)}
            </span>{" "}
            dari <span className="font-semibold">{kegiatanMitra?.length}</span> data
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
                if (page >= currentPage - 1 && page <= currentPage + 1) return true; // tampilkan sekitar currentPage
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${currentPage === page
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
          <button
            className="fixed bottom-4 right-4 p-4 rounded-full bg-blue-600 text-white shadow-lg 
                 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                 transform transition-transform hover:scale-110"
          >
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
    </div>
  );
}
