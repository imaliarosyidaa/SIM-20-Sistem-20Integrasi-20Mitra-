import React, { useState } from "react";
import { Kegiatan } from "@/interfaces/types";
import kegiatanApi from "@/lib/kegiatanApi";
import useAuth from "@/hooks/use-auth";
import useKegiatanApi from "@/lib/kegiatanApi";

export default function AddKegiatan() {
  const [formData, setFormData] = useState<Kegiatan>({
    nama_survei_sobat: "",
    bulan: "Januari",
    nama_survei: "",
    tahun: 2025,
    tanggal: "",
    tim: "",
    kegiatan: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const {createKegiatan} = useKegiatanApi();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await createKegiatan(formData);
      setSuccess("Kegiatan berhasil ditambahkan!");
      setFormData({
        nama_survei_sobat: "",
        bulan: "Januari",
        nama_survei: "",
        tahun: 2025,
        tanggal: "",
        tim: "",
        kegiatan: "",
      });
    } catch (err) {
      console.error("Gagal menambahkan kegiatan:", err);
      setError("Gagal menambahkan kegiatan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white shadow-md p-8 rounded-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Tambah Kegiatan</h2>

        {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
        {success && <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{success}</div>}

        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm font-semibold mb-2">Nama Survei Sobat<span className="text-red-500">*</span></label>
              <p className="text-xs text-gray-500 mb-2">Contoh: (SHK25-OUTLET) SURVEI HARGA KONSUMEN (SHK) OUTLET TAHUN 2025</p>
              <input
                autoComplete="off"
                type="text"
                name="nama_survei_sobat"
                value={formData.nama_survei_sobat}
                onChange={handleInputChange}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Masukan nama survei sobat"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm font-semibold mb-2">Bulan<span className="text-red-500">*</span></label>

              <select
                name="bulan"
                value={formData.bulan}
                onChange={handleInputChange}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="Januari">Januari</option>
                <option value="Februari">Februari</option>
                <option value="Maret">Maret</option>
                <option value="April">April</option>
                <option value="Mei">Mei</option>
                <option value="Juni">Juni</option>
                <option value="Juli">Juli</option>
                <option value="Agustus">Agustus</option>
                <option value="September">September</option>
                <option value="Oktober">Oktober</option>
                <option value="November">November</option>
                <option value="Desember">Desember</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm font-semibold mb-2">Nama Survei<span className="text-red-500">*</span></label>
              <p className="text-xs text-gray-500 mb-2">Contoh: Hk 2.1 Outlet</p>
              <input
                type="text"
                autoComplete="off"
                name="nama_survei"
                value={formData.nama_survei}
                onChange={handleInputChange}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Masukan nama survei"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm font-semibold mb-2">Tahun<span className="text-red-500">*</span></label>
              <select
                name="tahun"
                value={formData.tahun}
                onChange={handleInputChange}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm font-semibold mb-2">Tanggal Lapangan<span className="text-red-500">*</span></label>
              <p className="text-xs text-gray-500 mb-2">Contoh: 14-16</p>
              <input
                type="text"
                name="tanggal"
                autoComplete="off"
                value={formData.tanggal}
                onChange={handleInputChange}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Masukan tanggal lapangan"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm font-semibold mb-2">Tim<span className="text-red-500">*</span></label>
              <p className="text-xs text-gray-500 mb-2">Contoh: Harga</p>
              <input
                type="text"
                name="tim"
                autoComplete="off"
                value={formData.tim}
                onChange={handleInputChange}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Masukan tim"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm font-semibold mb-2">Kegiatan<span className="text-red-500">*</span></label>
              <p className="text-xs text-gray-500 mb-2">Contoh: PENDATAAN - BULAN I</p>
              <input
                type="text"
                name="kegiatan"
                autoComplete="off"
                value={formData.kegiatan}
                onChange={handleInputChange}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Masukan kegiatan"
                required
              />
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-6">* Kolom wajib diisi. Pastikan semua kolom yang ditandai telah diisi.</p>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Menyimpan..." : "Simpan Kegiatan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}