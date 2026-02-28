import React, { useState } from "react";
import { Kegiatan } from "@/interfaces/types";
import useKegiatanApi from "@/lib/kegiatanApi";
import { Alert } from "@mui/material";

const Tim = [
  'Umum',
  'Humas, Pojok Statistik dan PSS',
  'IPDS',
  'Sosial',
  'Produksi',
  'Distribusi',
  'Nerwilis',
  'SAKIP, ZI dan EPSS',
  'Harga',
]

export default function AddKegiatan() {
  const [formData, setFormData] = useState<Kegiatan>({
    nama_survei_sobat: "",
    bulan: "Januari",
    nama_survei: "",
    tahun: null,
    tanggal: "",
    tim: "",
    kegiatan: "",
    judul: "PENDATAAN_LAPANGAN",
    jenis_kegiatan: "PENDATAAN_LAPANGAN",
    hari: "",
    tanggal_mulai: null,
    hari_selesai: "",
    tanggal_selesai: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { createKegiatan } = useKegiatanApi();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [name]: type === "number" ? (value === "" ? null : Number(value)) : value,
      };
      return newData;
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    console.log("Submitting form data:", formData);
    try {
      await createKegiatan(formData);
      setSuccess("Kegiatan berhasil ditambahkan!");
      setFormData({
        nama_survei_sobat: "",
        bulan: "Januari",
        nama_survei: "",
        tahun: null,
        tanggal: "",
        tim: "",
        kegiatan: "",
        judul: "PENDATAAN_LAPANGAN",
        jenis_kegiatan: "PENDATAAN_LAPANGAN",
        hari: "",
        tanggal_mulai: null,
        hari_selesai: "",
        tanggal_selesai: null,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.response?.data.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto bg-white shadow-sm border border-gray-100 p-8 rounded-xl relative">
        {/* Header Section */}
        <div className="border-b border-gray-100 pb-5 mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Tambah Kegiatan Baru</h2>
          <p className="text-sm text-gray-500 mt-1">Lengkapi informasi survei dan jadwal lapangan untuk memulai kegiatan baru.</p>
        </div>

        {/* Floating Alert */}
        {error && (
          <Alert variant="filled" severity="error" className='w-fit fixed top-20 right-8 z-50 animate-bounce'>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="filled" severity="success" className='w-fit fixed top-20 right-8 z-50'>
            {success}
          </Alert>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-8">

          {/* Bagian 1: Identitas Survei */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-5 w-1 bg-indigo-600 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-700">Detail Survei</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">
                  Nama Survei Singkat <span className="text-red-500">*</span>
                </label>
                <p className="text-[11px] text-gray-400 mb-2 italic">Contoh: KSA Padi</p>
                <input
                  type="text"
                  autoComplete="off"
                  name="nama_survei"
                  value={formData.nama_survei}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm"
                  placeholder="Masukan nama survei"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">
                  Nama Survei Sobat <span className="text-gray-400 font-normal text-xs ml-1">(Opsional)</span>
                </label>
                <p className="text-[11px] text-gray-400 mb-2 italic">Contoh: (SHK25-OUTLET) SURVEI HARGA KONSUMEN...</p>
                <input
                  autoComplete="off"
                  type="text"
                  name="nama_survei_sobat"
                  value={formData.nama_survei_sobat}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm"
                  placeholder="Masukan nama survei sobat"
                  required
                />
              </div>
            </div>
          </section>

          {/* Bagian 2: Waktu & Organisasi */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-5 w-1 bg-indigo-600 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-700">Waktu & Tim</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Bulan <span className="text-red-500">*</span></label>
                <select
                  name="bulan"
                  value={formData.bulan}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm"
                  required
                >
                  <option value="" disabled>Pilih Bulan</option>
                  {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Tahun <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="tahun"
                  autoComplete="off"
                  value={formData.tahun ?? ""}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm font-mono"
                  placeholder="2026"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Tim <span className="text-red-500">*</span></label>
                <select
                  name="tim"
                  value={formData.tim}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm"
                  required
                >
                  <option value="" disabled>Pilih Tim</option>
                  {Tim.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Row Tanggal Mulai */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1.5">Tanggal Mulai <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 gap-2">
                  <input
                    type="date"
                    name="tanggal_mulai"
                    value={formData.tanggal_mulai}
                    onChange={handleInputChange}
                    className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                </div>
              </div>

              {/* Row Tanggal Selesai */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1.5">Tanggal Selesai <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 gap-2">
                  <input
                    type="date"
                    name="tanggal_selesai"
                    value={formData.tanggal_selesai}
                    onChange={handleInputChange}
                    className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Bagian 3: Detail Kegiatan & Jadwal */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-5 w-1 bg-indigo-600 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-700">Pelaksanaan</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Tanggal Lapangan <span className="text-gray-400 font-normal text-xs ml-1">(Opsional)</span></label>
                <p className="text-[11px] text-gray-400 mb-2 italic">Contoh format: 14-16 / Mingguan / dst</p>
                <input
                  type="text"
                  name="tanggal"
                  autoComplete="off"
                  value={formData.tanggal}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm font-mono"
                  placeholder="14-16"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Nama Kegiatan <span className="text-gray-400 font-normal text-xs ml-1">(Opsional)</span></label>
                <p className="text-[11px] text-gray-400 mb-2 italic">Contoh: PENDATAAN - BULAN I</p>
                <input
                  type="text"
                  name="kegiatan"
                  autoComplete="off"
                  value={formData.kegiatan}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm"
                  placeholder="Masukan kegiatan"
                  required
                />
              </div>
            </div>
          </section>

          <section className="mt-8">
            {/* Bagian 4: Penjadwalan & Tipe Kegiatan */}
            <div className="flex items-center gap-2 mb-4">
              <div className="h-5 w-1 bg-indigo-600 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-700">Jenis Kegiatan</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Judul & Jenis Kegiatan (Enum) */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1.5">Judul Tipe <span className="text-red-500">*</span></label>
                <select
                  name="judul"
                  value={formData.judul || 'PENDATAAN_LAPANGAN'}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                >
                  <option value="PENDATAAN_LAPANGAN">Pendataan Lapangan</option>
                  <option value="PENGAWASAN_LAPANGAN">Pengawasan Lapangan</option>
                  <option value="PENGOLAHAN">Pengolahan</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1.5">Jenis Kegiatan <span className="text-red-500">*</span></label>
                <select
                  name="jenis_kegiatan"
                  value={formData.jenis_kegiatan || 'PENDATAAN_LAPANGAN'}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                >
                  <option value="PENDATAAN_LAPANGAN">Pendataan Lapangan</option>
                  <option value="PENGAWASAN_LAPANGAN">Pengawasan Lapangan</option>
                  <option value="PENGOLAHAN">Pengolahan</option>
                </select>
              </div>

            </div>
          </section>

          {/* Footer Actions */}
          <div className="pt-8 mt-4 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-xs text-gray-400 italic">* Kolom wajib diisi. Pastikan informasi sudah sesuai sebelum menyimpan.</p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-lg text-white font-bold text-sm shadow-lg transition-all active:scale-95
              ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'}
            `}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Kegiatan"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}