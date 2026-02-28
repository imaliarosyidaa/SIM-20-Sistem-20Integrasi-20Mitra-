import React, { useEffect, useState } from "react";
import useKegiatanMitraApi from "@/lib/kegaiatanMitraApi";
import { Alert } from "@mui/material";
import Table from "@/components/table";
import { access } from "fs";

export const AVAILABLE_COLUMNS = [
  { id: 'No.', label: 'No.' },
  { id: "judul", label: "Judul" },
  { id: "no_kontrak_spk", label: "No. Kontrak SPK" },
  { id: "no_kontrak_bast", label: "No. Kontrak BAST" },
  { id: "hari", label: "Hari" },
  { id: "tanggal_mulai", label: "Tanggal Mulai" },
  { id: "bulan", label: "Bulan" },
  { id: "bulan_angka", label: "Bulan (Angka)" },
  { id: "hari_selesai", label: "Hari Selesai" },
  { id: "tanggal_selesai", label: "Tanggal Selesai" },
  { id: "tahun", label: "Tahun" },
  { id: "no_urut_mitra", label: "No. Urut Mitra" },
  { id: "nama_petugas", label: "Nama Mitra" },
  { id: "jenisKelamin", label: "Jenis Kelamin" },
  { id: "kecamatan", label: "Kecamatan" },
  { id: "id_sobat", label: "ID Sobat" },
  { id: "tim", label: "Tim" },
  { id: "nama_survei", label: "Nama Survei" },
  { id: "satuan", label: "Satuan Alokasi" },
  { id: "volum", label: "Alokasi" },
  { id: "harga_per_satuan", label: "Harga Per Satuan" },
  { id: "jumlah", label: "Jumlah" },
];

export const SORT_BY_OPTIONS = [
  { id: "tim", label: "Tim" },
  { id: "nama_survei", label: "Nama Survei" },
  { id: "nama_petugas", label: "Nama Petugas" },
];


export const columns = [
  {
    accessor: "No.", Header: "No.", Cell: ({ row, state }) => {
      const { pageSize, pageIndex } = state;
      const rowIndex = row.index;
      const globalIndex = pageIndex * pageSize + rowIndex + 1;
      return globalIndex;
    }
  },
  { accessor: "judul", Header: "Judul" },
  { accessor: "no_kontrak_spk", Header: "No_Kontrak_SPK" },
  { accessor: "no_kontrak_bast", Header: "No_Kontrak_BAST" },
  { accessor: "hari", Header: "Hari" },
  { accessor: "tanggal_mulai", Header: "Tanggal_Mulai" },
  { accessor: "bulan", Header: "Bulan" },
  { accessor: "bulan_angka", Header: "Bulan_Angka" },
  { accessor: "hari_selesai", Header: "Hari_Selesai" },
  { accessor: "tanggal_selesai", Header: "Tanggal_Selesai" },
  { accessor: "tahun", Header: "Tahun" },
  { accessor: "no_urut_mitra", Header: "No_Urut_Mitra" },
  { accessor: "nama_petugas", Header: "Nama_Mitra" },
  {
    accessor: "jenisKelamin",
    Header: "Jenis Kelamin",
    Cell: ({ value }: { value: string }) => {
      if (value === 'Lk') return 'Laki-Laki';
      if (value === 'Pr') return 'Perempuan';
      return value || '-';
    }
  },
  { accessor: "jenis_kegiatan", Header: "Jenis_Kegiatan" },
  { accessor: "kecamatan", Header: "Kecamatan" },
  { accessor: "id_sobat", Header: "Id_Sobat" },
  { accessor: "tim", Header: "Tim" },
  { accessor: "nama_survei", Header: "Nama_Survei" },
  { accessor: "satuan", Header: "Satuan_Alokasi" },
  { accessor: "volum", Header: "Alokasi" },
  { accessor: "harga_per_satuan", Header: "Harga_Persatuan" },
  { accessor: "jumlah", Header: "Jumlah" },
];

export default function DownloadKegiatan() {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(AVAILABLE_COLUMNS.map(c => c.id));
  const [sortBy, setSortBy] = useState("tim");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isLoading, setIsLoading] = useState(false);
  const [isDataCreated, setIsDataCreated] = useState(false)
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const YEARS = ["2023", "2024", "2025", "2026"];

  const { downloadKegiatanExcel } = useKegiatanMitraApi();

  const col = columns.map((col) => {
    return selectedColumns.includes(col.accessor) ? col : null;
  }).filter(Boolean);

  const handleToggleColumn = (id: string) => {
    setSelectedColumns(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleDownloadClick = async () => {
    if (selectedColumns.length === 0) {
      setError("Silakan pilih minimal satu kolom untuk didownload.");
      return;
    }

    setIsLoading(true);
    setError(null);

    downloadKegiatanExcel(selectedColumns, sortBy, sortOrder, selectedYear)
      .then((response) => {
        setPreviewData(response);
        setIsDataCreated(true);
        setError(null);
      })
      .catch((err: any) => {
        console.error("Download gagal:", err);
        setError("Gagal mengunduh file kegiatan. Silakan coba lagi.");
      })
      .finally(() => setIsLoading(false));
  };

  const [showAlert, setShowAlert] = useState(true);

  const handleClose = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <div className="space-y-6 p-6 w-full">
      <div className="max-w-none mx-auto w-full">
        {/* Alert Error Style Kamu */}
        {error && showAlert && (
          <Alert onClose={handleClose} variant="filled" severity="error" className='w-fit bottom-4 right-4 fixed z-50'>
            {error}
          </Alert>
        )}

        <div className="bg-white border rounded-md p-4 px-4 md:p-8 mb-6 w-full shadow-sm">
          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">

            {/* SISI KIRI: Info & Filter Kolom */}
            <div className="text-gray-600">
              <p className="font-medium text-lg">Download Data Kegiatan</p>
              <p className="text-xs text-gray-400 mb-4 italic">Pilih kolom yang ingin disertakan dalam file Excel.</p>

              {/* FILTER TAHUN (Radio Button) */}
              <div>
                <p className="font-medium text-sm text-gray-800 mb-3">Pilih Tahun Kegiatan</p>
                <div className="flex flex-wrap gap-4">
                  {YEARS.map((year) => (
                    <label key={year} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="filterTahun"
                        value={year}
                        checked={selectedYear === year}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className={`text-sm ${selectedYear === year ? 'text-blue-700 font-bold' : 'text-gray-500'}`}>
                        {year}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="my-4 border-t border-gray-300" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {AVAILABLE_COLUMNS.map((col) => (
                  <label key={col.id} className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-50 rounded-md transition-all">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(col.id)}
                      onChange={() => handleToggleColumn(col.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className={`text-sm transition-colors ${selectedColumns.includes(col.id) ? 'text-blue-700 font-semibold' : 'text-gray-500 group-hover:text-gray-700'}`}>
                      {col.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* SISI KANAN: Sorting & Action */}
            <div className="lg:col-span-2 border-l pl-0 lg:pl-8">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Urutkan Berdasarkan</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm outline-blue-500"
                  >
                    {SORT_BY_OPTIONS.map(col => <option key={col.id} value={col.id}>{col.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</label>
                  <div className="flex mt-1 border rounded-lg overflow-hidden h-[38px]">
                    <button
                      onClick={() => setSortOrder("asc")}
                      className={`flex-1 text-xs font-bold transition-colors ${sortOrder === 'asc' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    >
                      A-Z / ASC
                    </button>
                    <button
                      onClick={() => setSortOrder("desc")}
                      className={`flex-1 text-xs font-bold transition-colors ${sortOrder === 'desc' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    >
                      Z-A / DESC
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                <p className="text-sm text-gray-400 mb-4">Siap untuk memproses {selectedColumns.length} kolom data.</p>
                <button
                  onClick={handleDownloadClick}
                  disabled={isLoading || isDataCreated}
                  className={`flex items-center gap-3 px-8 py-3 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-magic" viewBox="0 0 16 16">
                    <path d="M9.5 2.672a.5.5 0 1 0 1 0V.843a.5.5 0 0 0-1 0zm4.5.035A.5.5 0 0 0 13.293 2L12 3.293a.5.5 0 1 0 .707.707zM7.293 4A.5.5 0 1 0 8 3.293L6.707 2A.5.5 0 0 0 6 2.707zm-.621 2.5a.5.5 0 1 0 0-1H4.843a.5.5 0 1 0 0 1zm8.485 0a.5.5 0 1 0 0-1h-1.829a.5.5 0 0 0 0 1zM13.293 10A.5.5 0 1 0 14 9.293L12.707 8a.5.5 0 1 0-.707.707zM9.5 11.157a.5.5 0 0 0 1 0V9.328a.5.5 0 0 0-1 0zm1.854-5.097a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L8.646 5.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0l1.293-1.293Zm-3 3a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L.646 13.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0z" />
                  </svg>
                  <span>{isLoading ? 'Menyiapkan File...' : 'Generate Tabel'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer ala Sipadu kamu */}
        <div className="flex justify-end pr-2">
          <span className="text-[10px] text-gray-300 font-mono uppercase tracking-widest">
            Malowopati Export Engine v1.0
          </span>
        </div>

        {isDataCreated && (
          <>
            {showAlert && (
              <Alert onClose={handleClose} variant="filled" severity="success" className='w-fit bottom-20 right-4 fixed z-50'>
                File kegiatan siap diunduh. Klik tombol "Download" di atas.
              </Alert>
            )}
            <Table columns={col} data={previewData} isLoading={isLoading} />
          </>
        )}
      </div>
    </div>
  );
}