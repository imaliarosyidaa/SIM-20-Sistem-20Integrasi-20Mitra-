import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from '@components/ui/input'
import { Link } from "react-router-dom";
import ComboBox from "@/components/combobox";
import Skeleton from 'react-loading-skeleton'
import { KegiatanMitraResponse } from "@/interfaces/types";
import useAuth from "@/hooks/use-auth";
import useUserApi from "@/lib/userApi";
import useKegiatanMitraApi from "@/lib/kegaiatanMitraApi";
import { months } from '../constants'
import useKegiatanApi from "@/lib/kegiatanApi";
import { AlertDialog } from "@/components/alertdialog";


export default function HonorBulanan() {
  const [kegiatanMitra, setKegiatanMitra] = useState<KegiatanMitraResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [expandedInputRows, setExpandedInputRows] = useState<number[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const currentYear = new Date().getFullYear();
  const [tim, setTim] = useState('');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [formData, setFormData] = useState({
    volum: "",
    harga_per_satuan: "",
    id_sobat: "",
    pcl_pml_olah: '',
    satuan: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  const totalPages = Math.ceil(kegiatanMitra?.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = kegiatanMitra?.slice(indexOfFirstRow, indexOfLastRow);
  const { auth } = useAuth();
  const { getAllUsers } = useUserApi();
  const { deleteKegiatan } = useKegiatanApi();
  const { getKegiatanMitra, createKegiatanMitra, deleteKegiatanMitra } = useKegiatanMitraApi();

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

  useEffect(() => {
    fetchData(selectedYear, selectedMonth, tim);
  }, [selectedYear, selectedMonth, tim]);


  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
  };

  async function handleFormSubmit(event, kegiatan, mitraData) {
    event.preventDefault();

    const payload = {
      ...formData,
      kegiatanId: kegiatan.kodeKegiatan,
      jumlah: Number(formData.harga_per_satuan) * Number(formData.volum)
    };
    createKegiatanMitra(payload)
      .then(() => {
        fetchData(selectedYear, selectedMonth, tim);
        setFormData({
          volum: "",
          harga_per_satuan: "",
          id_sobat: '',
          pcl_pml_olah: '',
          satuan: ''
        })
      })
      .catch((err) => { setError(true) })
      .finally(() => { setIsLoading(false) })
  }

  async function deleteData(id) {
    setError(null);
    setIsLoading(true)

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
    setSelectedYear(currentYear);
    setSelectedMonth('')
  };

  return (
    <div className="space-y-6 p-6">
      <div className="w-full bg-white p-4 rounded rounded-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl">Tim Kegiatan</h1>
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
                const year = Number(e.target.value);
                setSelectedYear(year);
                getKegiatanMitra(year, selectedMonth, tim);
              }}
              className="border rounded px-3 py-2"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => {
                const month = e.target.value;
                setSelectedMonth(month);
                getKegiatanMitra(selectedYear, month, tim);
              }}
              className="border rounded px-3 py-2"
            >
              <option>
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
              className="flex items-center px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset Filter
            </button>
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white rounded-md">
        <table className="w-full overflow-hidden">
          <thead className="bg-[#0DBEFF]">
            <tr>
              <th className="p-2">No.</th>
              <th className="p-2">Bulan</th>
              <th className="p-2">Tanggal</th>
              <th className="p-2">Tim</th>
              <th className="p-2">Nama Survei</th>
              <th className="p-2 text-left">Nama Survei Sobat</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j}><Skeleton height={20} width="80%" /></td>
                  )
                  )}
                </tr>
              ))
            ) : (
              currentRows.map((kegiatan, index) => (
                <React.Fragment key={kegiatan.id}>
                  <tr className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => toggleRow(kegiatan.id)} key={index}>
                    <td className="p-2 text-center">{index + 1}.</td>
                    <td className="p-2 text-center text-sm lg:text-normal font-medium">{kegiatan.bulan}</td>
                    <td className="p-2 text-center text-sm lg:text-normal font-medium">{kegiatan.tanggal}</td>
                    <td className="p-2 text-center text-sm lg:text-normal font-medium">{kegiatan.tim}</td>
                    <td className="p-2 text-center text-sm lg:text-normal font-medium">{kegiatan.nama_survei}</td>
                    <td className="p-2 text-start text-sm lg:text-normal font-medium">{kegiatan.nama_survei_sobat}</td>
                    <td className="p-2 text-center">
                      {expandedRows.includes(kegiatan.id) ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </td>
                  </tr>
                  {expandedRows.includes(kegiatan.id) && (
                    <tr className="border-t">
                      <td colSpan={7} className="p-4">
                        {Array.isArray(kegiatan.mitra) && kegiatan.mitra?.length > 0 ? (
                          <div className="overflow-x-auto rounded-lg shadow-sm border">
                            <table className="min-w-full divide-y divide-gray-200 font-semibold">
                              <thead className="bg-warning">
                                <tr>
                                  <th className="p-2 text-center">No.</th>
                                  <th className="p-2">Nama Petugas</th>
                                  <th className="p-2 text-center">Volume</th>
                                  <th className="p-2 text-center">Harga per Satuan</th>
                                  <th className="p-2 text-center">Jumlah</th>
                                  <th className="p-2 text-center">Aksi</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {kegiatan.mitra.map((pcl, index) => (
                                  <tr key={index} className="hover:bg-gray-50 transition">
                                    <td className="whitespace-nowrap text-center">{index + 1}.</td>
                                    <td className="whitespace-nowrap">{pcl.nama_petugas}</td>
                                    <td className="whitespace-nowrap text-center">{pcl.volum}</td>
                                    <td className="whitespace-nowrap text-center">{new Intl.NumberFormat("id-ID").format(pcl.harga_per_satuan)}</td>
                                    <td className="whitespace-nowrap text-center font-medium text-gray-700">
                                      {new Intl.NumberFormat("id-ID").format(pcl.jumlah)}
                                    </td>
                                    <td className="text-center whitespace-nowrap text-right text-sm font-medium space-x-2">
                                      <Button
                                        onClick={() => handleOpenDialog("mitra",pcl.id)}
                                        className=""
                                        variant="destructive"
                                        size="sxl"
                                      >
                                        Hapus
                                      </Button>
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

                        <div className="flex items-center gap-4">
                          <div
                            onClick={() => handleOpenDialog("kegiatan",kegiatan.id)}
                            className="w-fit flex items-center gap-2 pt-4 cursor-pointer hover:underline text-red-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                            </svg>
                            Hapus Kegiatan
                          </div>
                          <div
                            onClick={() => toggleRowInput(kegiatan.id)}
                            className="w-fit flex items-center gap-2 pt-4 cursor-pointer hover:underline text-red-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-dotted" viewBox="0 0 16 16">
                              <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                            </svg>
                            Tambah Mitra
                          </div>
                        </div>

                        {expandedInputRows.includes(kegiatan.id) && (
                          <form
                            onSubmit={(e) => handleFormSubmit(e, kegiatan, mitraData)}
                            method="POST"
                            className="bg-white my-4 py-4 px-6 border rounded-lg shadow-sm"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                              }
                            }}
                          >
                            <div className="grid grid-cols-3 gap-6 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama<span className="text-red-500">*</span></label>
                                <ComboBox
                                  data={mitraData}
                                  labelKey="namaLengkap"
                                  valueKey="sobatId"
                                  placeholder="Pilih mitra..."
                                  onChange={(mitra) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      id_sobat: mitra.sobatId,
                                    }))
                                  }
                                />

                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">PCL/PML/OLAH<span className="text-red-500">*</span></label>

                                <select
                                  name="pcl_pml_olah"
                                  value={formData.pcl_pml_olah}
                                  onChange={handleInputChange}
                                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm 
                                          hover:border-indigo-400 transition duration-150 ease-in-out"
                                >
                                  <option value="" disabled className="text-gray-400">Pilih salah satu</option>
                                  <option key="pcl" value="PCL">PCL</option>
                                  <option key="PML" value="PML">PML</option>
                                  <option key="Pengolah" value="Pengolah">PENGOLAH</option>
                                </select>

                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Satuan<span className="text-red-500">*</span></label>
                                <Input
                                  type="text"
                                  value={formData.satuan}
                                  onChange={handleInputChange}
                                  name="satuan"
                                  placeholder="Masukan Satuan"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Volume<span className="text-red-500">*</span></label>
                                <Input
                                  type="number"
                                  value={formData.volum}
                                  onChange={handleInputChange}
                                  name="volum"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Harga Per Satuan<span className="text-red-500">*</span></label>
                                <Input
                                  type="number"
                                  value={formData.harga_per_satuan}
                                  onChange={handleInputChange}
                                  name="harga_per_satuan"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end">
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
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600">
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
              className="flex items-center px-3 py-1.5 rounded-md border text-sm disabled:opacity-40 hover:bg-gray-100"
            >
              <ChevronLeft size={16} />
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
                      <span className="px-2 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1.5 rounded-md text-sm ${currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "border hover:bg-gray-100"
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
              className="flex items-center px-3 py-1.5 rounded-md border text-sm disabled:opacity-40 hover:bg-gray-100"
            >
              Next
              <ChevronRight size={16} />
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
