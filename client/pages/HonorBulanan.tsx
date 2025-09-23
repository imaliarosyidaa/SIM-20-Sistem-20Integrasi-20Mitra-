import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactTabulator } from 'react-tabulator'
import { Input } from '@components/ui/input'
import { Link } from "react-router-dom";
import ComboBox from "@/components/combobox";
import userApi from "@/lib/userApi";
import Skeleton from 'react-loading-skeleton'
import kegaiatanMitraApi from "@/lib/kegaiatanMitraApi";
import { KegiatanMitraResponse } from "@/interfaces/types";
import useAuth from "@/hooks/use-auth";


export default function HonorBulanan() {
  const [kegiatanMitra, setKegiatanMitra] = useState<KegiatanMitraResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [expandedInputRows, setExpandedInputRows] = useState<number[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    volum: "",
    harga_per_satuan: "",
    id_sobat: "",
    pcl_pml_olah: '',
    satuan: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(kegiatanMitra.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = kegiatanMitra.slice(indexOfFirstRow, indexOfLastRow);
  const { auth } = useAuth();

  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const [mitraData, setMitraData] = useState([]);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleRowInput = (id: number) => {
    setExpandedInputRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  }

  const toggleSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]
    );
  };


  function fetchData() {
    setIsLoading(true);
    Promise.all([
      kegaiatanMitraApi.getKegiatanMitra(auth.accessToken),
      userApi.getAllUsers(auth.accessToken)
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
    fetchData();
  }, []);


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
    kegaiatanMitraApi.createKegiatanMitra(auth.accessToken, payload)
      .then(() => {
        fetchData();
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
    kegaiatanMitraApi.deleteKegiatanMitra(auth.accessToken, id)
      .then(() => {
        setKegiatanMitra(prev =>
          prev.map(group => ({
            ...group,
            mitra: group.mitra.filter(m => m.id !== id)
          }))
        );
      })
      .catch()
      .finally()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <table className="w-full border overflow-hidden">
        <thead className="w-full">
          <tr>
            <th colSpan={7} className="p-4">
              <div className="flex justify-between">
                <div>Tim Kegiatan</div>
                <div className="flex gap-4 items-center">
                  <Link to="/upload-template" className="flex gap-2">
                    <Button variant="outline">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upload" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                        <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
                      </svg>
                      <p>
                        Upload Template
                      </p>
                    </Button>
                  </Link>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <thead className="">
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
                <tr className="border-t hover:bg-gray-50" key={index}>
                  <td className="p-2 text-center">{kegiatan.id}.</td>
                  <td className="p-2 text-center text-xs">{kegiatan.bulan}</td>
                  <td className="p-2 text-center text-xs">{kegiatan.tanggal}</td>
                  <td className="p-2 text-center text-xs">{kegiatan.tim}</td>
                  <td className="p-2 text-center text-xs">{kegiatan.nama_survei}</td>
                  <td className="p-2 text-start text-xs text-blue-600/100 hover:underline hover:underline-offset-auto cursor-pointer" onClick={() => toggleRow(kegiatan.id)}>{kegiatan.nama_survei_sobat}</td>
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
                    <td colSpan={7} className="p-4 text-sm text-gray-600">
                      {Array.isArray(kegiatan.mitra) && kegiatan.mitra.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg shadow-sm border">
                          <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide">
                                  No.
                                </th>
                                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide">
                                  Nama Petugas
                                </th>
                                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide">
                                  Volume
                                </th>
                                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide">
                                  Harga per Satuan
                                </th>
                                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide">
                                  Jumlah
                                </th>
                                <th className="px-6 py-3 text-right font-semibold text-gray-600 uppercase tracking-wide">
                                  Aksi
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {kegiatan.mitra.map((pcl, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition">
                                  <td className="px-6 py-3 whitespace-nowrap">{index + 1}.</td>
                                  <td className="px-6 py-3 whitespace-nowrap">{pcl.nama_petugas}</td>
                                  <td className="px-6 py-3 whitespace-nowrap">{pcl.volum}</td>
                                  <td className="px-6 py-3 whitespace-nowrap">{new Intl.NumberFormat("id-ID").format(pcl.harga_per_satuan)}</td>
                                  <td className="px-6 py-3 whitespace-nowrap font-medium text-gray-700">
                                    {new Intl.NumberFormat("id-ID").format(pcl.jumlah)}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <Button
                                      onClick={() => deleteData(pcl.id)}
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

                      <div
                        onClick={() => toggleRowInput(kegiatan.id)}
                        className="w-fit flex items-center gap-2 pt-4 cursor-pointer hover:underline text-red-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-dotted" viewBox="0 0 16 16">
                          <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                        </svg>
                        Tambah
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
            {indexOfFirstRow + 1}-{Math.min(indexOfLastRow, kegiatanMitra.length)}
          </span>{" "}
          dari <span className="font-semibold">{kegiatanMitra.length}</span> data
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-1.5 rounded-md border text-sm disabled:opacity-40 hover:bg-gray-100"
          >
            <ChevronLeft size={16} />
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1.5 rounded-md text-sm ${currentPage === i + 1
                ? "bg-indigo-600 text-white"
                : "border hover:bg-gray-100"
                }`}
            >
              {i + 1}
            </button>
          ))}
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
  );
}
