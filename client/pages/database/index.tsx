import React, { useState, useEffect, useRef } from "react";
import { Upload, Download } from "lucide-react";
import useUserApi from "@/lib/userApi";
import Table from "@/components/table";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import useAxiosPrivate from "@/hooks/use-axios-private";
import Swal from "sweetalert2";

// ================= COLUMNS =================

export const columns = [
  {
    id: "no",
    Header: "No.",
    Cell: ({ row }: any) => row.index + 1,
    disableSortBy: true,
  },
  { accessor: "namaLengkap", Header: "Nama Lengkap" },
  { accessor: "posisi", Header: "Posisi" },
  { accessor: "statusSeleksi", Header: "Status Seleksi" },
  { accessor: "posisiDaftar", Header: "Posisi Daftar" },
  { accessor: "alamatDetail", Header: "Alamat Detail" },
  { accessor: "alamatProv", Header: "Alamat Prov" },
  { accessor: "alamatKab", Header: "Alamat Kab" },
  { accessor: "alamatKec", Header: "Alamat Kec" },
  { accessor: "alamatDesa", Header: "Alamat Desa" },
  { accessor: "tempatTanggalLahir", Header: "Tempat Tanggal Lahir" },
  { accessor: "jenisKelamin", Header: "Jenis Kelamin" },
  { accessor: "pendidikan", Header: "Pendidikan" },
  { accessor: "pekerjaan", Header: "Pekerjaan" },
  { accessor: "deskripsiPekerjaan", Header: "Deskripsi Pekerjaan" },
  { accessor: "noTelp", Header: "No Telp" },
  { accessor: "sobatId", Header: "SOBAT ID" },
  { accessor: "email", Header: "Email" },
  {
    accessor: "tahun",
    Header: "Tahun",
    Cell: ({ value }: any) => (Array.isArray(value) ? value.join(", ") : "-"),
  },
];

// ================= COMPONENT =================

export default function DatabaseMitra() {
  const [mitraData, setMitraData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const [tahunUpload, setTahunUpload] = useState("");
  const [filterTahun, setFilterTahun] = useState("");

  const [tahunList, setTahunList] = useState<number[]>([]);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { getAllUsers, updateUser, deleteUser } = useUserApi();
  const axiosPrivate = useAxiosPrivate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ================= FETCH DATA =================

  const fetchUsers = async () => {
    setIsLoading(true);

    try {
      const data = await getAllUsers();

      const mappedData = data.map((item: any) => ({
        ...item,
        onEdit: handleEdit,
        onDelete: handleDelete,
      }));

      setMitraData(mappedData);

      // ambil list tahun otomatis
      const years = new Set<number>();

      data.forEach((item: any) => {
        if (Array.isArray(item.tahun)) {
          item.tahun.forEach((t: number) => years.add(t));
        }
      });

      setTahunList(Array.from(years).sort());

    } catch (err) {
      toast.error("Gagal mengambil data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= DOWNLOAD TEMPLATE =================

  const handleDownloadTemplate = () => {
    const headers = [
      "Nama Lengkap",
      "Posisi",
      "Status Seleksi",
      "Posisi Daftar",
      "Alamat Detail",
      "Alamat Prov",
      "Alamat Kab",
      "Alamat Kec",
      "Alamat Desa",
      "Tempat Tanggal Lahir",
      "Jenis Kelamin",
      "Pendidikan",
      "Pekerjaan",
      "Deskripsi Pekerjaan",
      "No Telp",
      "SOBAT ID",
      "Email",
    ];

    const csvContent = headers.join(";");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "template_mitra.csv";
    link.click();

    toast.success("Template berhasil di-download");
  };

  // ================= HANDLE FILE =================

  const handleFileUpload = async (file: File) => {
    if (!tahunUpload) {
      toast.error("Tahun harus diisi");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);

    try {
      const response = await axiosPrivate.post(
        `/mitra/upload?tahun=${tahunUpload}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      Swal.fire({
        icon: "success",
        title: "Upload Berhasil",
        html: `
        <b>${response.data.data.inserted}</b> data baru ditambahkan <br/>
        <b>${response.data.data.updated}</b> data diperbarui
        `,
      });

      setIsUploadModalOpen(false);
      setTahunUpload("");

      await fetchUsers();

    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Upload gagal");
    } finally {
      setIsUploading(false);
    }
  };

  // ================= DRAG DROP =================

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  // ================= DELETE =================

  const handleDelete = async (user: any) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteUser(user.id);

      await fetchUsers();

      Swal.fire("Berhasil", "Data dihapus", "success");
    } catch {
      Swal.fire("Error", "Gagal hapus data", "error");
    }
  };

  // ================= EDIT =================

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateUser(selectedUser.id, selectedUser);

      await fetchUsers();

      setIsEditModalOpen(false);

      Swal.fire("Berhasil", "Data diperbarui", "success");
    } catch {
      Swal.fire("Error", "Gagal update", "error");
    }
  };

  // ================= FILTER =================

  const filteredData = mitraData.filter((item: any) => {
    if (!filterTahun) return true;

    return item.tahun?.includes(Number(filterTahun));
  });

  // ================= UI =================

  return (
    <div className="space-y-6 p-6">

      {/* TABLE */}

      <Table
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        filename="Data Mitra"
        onEdit={handleEdit}
        onDelete={handleDelete}
        tahunList={tahunList}
        filterTahun={filterTahun}
        onFilterTahunChange={setFilterTahun}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />

      {/* ================= MODAL UPLOAD ================= */}

      {isUploadModalOpen && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-lg w-96 space-y-4">

            <h2 className="font-bold text-lg">
              Upload Data Mitra
            </h2>

            <input
              type="number"
              placeholder="Tahun Mitra"
              value={tahunUpload}
              onChange={(e) => setTahunUpload(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed p-6 text-center rounded cursor-pointer"
            >

              Drag & Drop File di sini

              <br />

              <button
                className="text-blue-600 underline"
                onClick={() => fileInputRef.current?.click()}
              >
                pilih file
              </button>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />

            </div>

            <div className="flex justify-end">

              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-3 py-1 border rounded"
              >
                Tutup
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ================= MODAL EDIT ================= */}

      {isEditModalOpen && selectedUser && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-lg w-96 space-y-4">

            <h2 className="font-bold">Edit Mitra</h2>

            <input
              className="w-full border p-2 rounded"
              value={selectedUser.namaLengkap}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  namaLengkap: e.target.value,
                })
              }
            />

            <input
              className="w-full border p-2 rounded"
              value={selectedUser.email}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  email: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-2">

              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-3 py-1 border rounded"
              >
                Batal
              </button>

              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Simpan
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}