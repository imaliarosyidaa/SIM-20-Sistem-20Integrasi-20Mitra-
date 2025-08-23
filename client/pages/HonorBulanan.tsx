import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axios from '../lib/api'
import { Button } from "@/components/ui/button";
import { ReactTabulator } from 'react-tabulator'
import { Input } from '@components/ui/input'
import { Link } from "react-router-dom";


export default function HonorBulanan() {
  const [kegiatanMitra, setKegiatanMitra] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [expandedInputRows, setExpandedInputRows] = useState<number[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    volum: 0,
    harga_per_satuan: 0,
    nama_petugas: ''
  });

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

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get('/kegiatanmitra');
        if (Array.isArray(res.data.data)) {
          const formatted = res.data.data.map((kegiatan) => ({
            id: kegiatan.id,
            bulan: kegiatan.bulan,
            tanggal: kegiatan.tanggal,
            tim: kegiatan.tim,
            nama_survei: kegiatan.nama_survei,
            nama_survei_sobat: kegiatan.nama_survei_sobat,
            kegiatan: kegiatan.kegiatan,
            pcl_pml_olah: kegiatan.pcl_pml_olah,
            satuan: kegiatan.satuan,
            konfirmasi: kegiatan.konfirmasi,
            flag_sobat: kegiatan.flag_sobat,
            data: kegiatan.data
          }));
          setKegiatanMitra(formatted);
        } else {
          setKegiatanMitra([]);
        }
      } catch (err) {
        setError("Gagal mengambil data. Silakan coba lagi.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    getData();
  }, [kegiatanMitra]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
  };

  // Create Data
  async function handleFormSubmit(event, kegiatan) {
    event.preventDefault();

    const payload = {
      ...formData,
      bulan: kegiatan.bulan,
      tanggal: kegiatan.tanggal,
      tim: kegiatan.tim,
      nama_survei: kegiatan.nama_survei,
      nama_survei_sobat: kegiatan.nama_survei_sobat,
      kegiatan: kegiatan.kegiatan,
      pcl_pml_olah: kegiatan.pcl_pml_olah,
      id_sobat: kegiatan.id_sobat,
      satuan: kegiatan.satuan,
      konfirmasi: kegiatan.konfirmasi,
      flag_sobat: kegiatan.flag_sobat,
      jumlah: formData.harga_per_satuan * formData.volum
    };

    try {
      await axios.post('/kegiatanmitra',
        payload, {
        headers: {
          'Content-Type': 'application/json',
          "Accept": "*/*",
        },
      }
      );
      setFormData({
        volum: 0,
        harga_per_satuan: 0,
        nama_petugas: ''
      })
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      alert("update failed, please check your credentials.");
    }
  }

  // Delete Data
  async function deleteData(id) {
    try {
      await axios.delete("/kegiatanmitra/delete", {
        data: { id: id },
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Delete failed");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <table className="w-full border overflow-hidden">
        <thead className="w-full">
          <tr>
            <th colSpan={7} className="p-4">
              <div className="flex justify-between">
                <div>Tim Kegiatan</div>
                <div className="flex gap-4 items-center">
                  {selectedRows.length > 0 && (
                    <div className="space-x-2">
                      <Button size="sxl" variant="destructive">Delete</Button>
                    </div>
                  )}
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
            <th className="p-2"><input
              type="checkbox"
            />
            </th>
            <th className="p-2 text-left">Nama Survei Sobat</th>
            <th className="p-2">Nama Survei</th>
            <th className="p-2">Tim</th>
            <th className="p-2">Tanggal Lapangan</th>
            <th className="p-2">Bulan Lapangan</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {kegiatanMitra.map((kegiatan) => (
            <React.Fragment key={kegiatan.id}>
              <tr className="border-t hover:bg-gray-50">
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(kegiatan.id)}
                    onChange={() => toggleSelect(kegiatan.id)}
                  />
                </td>
                <td className="p-2 text-start text-xs text-blue-600/100 hover:underline hover:underline-offset-auto cursor-pointer" onClick={() => toggleRow(kegiatan.id)}>{kegiatan.nama_survei_sobat}</td>
                <td className="p-2 text-center text-xs">{kegiatan.nama_survei}</td>
                <td className="p-2 text-center text-xs">{kegiatan.tim}</td>
                <td className="p-2 text-center text-xs">{kegiatan.tanggal}</td>
                <td className="p-2 text-center text-xs">{kegiatan.bulan}</td>
                <td className="p-2 text-center">
                  <button>
                    {expandedRows.includes(kegiatan.id) ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>
                </td>
              </tr>
              {expandedRows.includes(kegiatan.id) && (
                <tr className="bg-gray-50 border-t">
                  <td colSpan={7} className="p-4 text-sm text-gray-600">
                    {Array.isArray(kegiatan.data) && kegiatan.data.length > 0 ? (
                      <ol className="list-decimal pl-5">
                        {kegiatan.data.map((pcl, index) => (
                          <li key={index} className="py-2">
                            <div className="grid grid-cols-5 gap-4 w-fit">
                              <span>{pcl.nama_petugas}</span>
                              <span className="text-left"><span className="font-bold">Volume : </span> {pcl.volum}</span>
                              <span className="text-left"><span className="font-bold">Harga per satuan : </span>{pcl.harga_per_satuan}</span>
                              <span className="text-left pl-12"><span className="font-bold">Jumlah : </span>{pcl.jumlah}</span>
                              <span className="text-left flex gap-2">
                                <span className="text-blue-600/100 cursor-pointer hover:underline hover:underline-offset-auto flex items-center gap-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                  </svg>
                                  Edit</span>
                                <span> | </span>
                                <span onClick={() => deleteData(pcl.id)} className="text-blue-600/100 cursor-pointer hover:underline hover:underline-offset-auto hover:underline-offset-auto flex items-center gap-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                                  </svg>
                                  Hapus</span>
                              </span>
                            </div>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <div className="text-gray-400 italic">Tidak ada data petugas</div>
                    )}
                    <div onClick={() => toggleRowInput(kegiatan.id)} className="w-fit flex items-center gap-2 pt-4 cursor-pointer hover:underline hover:underline-offset-auto text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-dotted" viewBox="0 0 16 16">
                        <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                      </svg>
                      Tambah
                    </div>
                    {expandedInputRows.includes(kegiatan.id) && (
                      <form onSubmit={(e) => handleFormSubmit(e, kegiatan)} method="POST" className="bg-white my-4 py-4 px-4 border">
                        <div className="flex flex-row gap-4 mb-4">
                          <div className="flex flex-row gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700 mb-1 ">Nama:</label>
                            <Input
                              type="text"
                              name="nama_petugas"
                              value={formData.nama_petugas}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="flex flex-row gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700 mb-1">Volume:</label>
                            <Input
                              type="number"
                              value={formData.volum}
                              onChange={handleInputChange}
                              name="volum"
                            />
                          </div>

                          <div className="flex flex-row gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700 mb-1">Harga Per Satuan:</label>
                            <Input
                              type="number"
                              value={formData.harga_per_satuan}
                              onChange={handleInputChange}
                              name="harga_per_satuan"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button type="submit"
                            variant="destructive" size="sxl">Simpan</Button>
                        </div>
                      </form>
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
