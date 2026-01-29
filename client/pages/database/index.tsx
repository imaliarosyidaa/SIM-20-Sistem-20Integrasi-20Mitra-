import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import useUserApi  from "@/lib/userApi";
import { UserResponse } from "@/interfaces/types";
import Table from "@/components/table";
import useAuth from "@/hooks/use-auth";
import useRefreshToken from '@/hooks/use-refresh-token'

export const columns = [
  {
    accessor: "id",
    Header: "No.",
  },
  {
    accessor: "namaLengkap",
    Header: "Nama Lengkap",
  },
  {
    accessor: "email",
    Header: "Email",
  },
  {
    accessor: "noTelp",
    Header: "No. Telepon",
  },
  {
    accessor: "jenisKelamin",
    Header: "Jenis Kelamin",
  },
  {
    accessor: "pekerjaan",
    Header: "Pekerjaan",
  },
  {
    accessor: "pendidikan",
    Header: "Pendidikan",
  },
  {
    accessor: "posisi",
    Header: "Posisi",
  },
  {
    accessor: "posisiDaftar",
    Header: "Posisi Daftar",
  },
  {
    accessor: "sobatId",
    Header: "Sobat ID",
  },
  {
    accessor: "statusSeleksi",
    Header: "Status Seleksi",
  },
  {
    accessor: "tempatTanggalLahir",
    Header: "Tempat & Tanggal Lahir",
  },
  {
    accessor: "alamatDetail",
    Header: "Alamat Detail",
  },
  {
    accessor: "alamatDesa",
    Header: "Alamat Desa",
  },
  {
    accessor: "alamatKec",
    Header: "Alamat Kecamatan",
  },
  {
    accessor: "alamatKab",
    Header: "Alamat Kabupaten",
  },
  {
    accessor: "alamatProv",
    Header: "Alamat Provinsi",
  },
  {
    accessor: "deskripsiPekerjaan",
    Header: "Deskripsi Pekerjaan",
  },
]


export default function DatabaseMitra() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mitraData, setMitraData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { auth } = useAuth();
  const { getAllUsers } = useUserApi();

   useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setMitraData(data);
      } catch (err) {
        console.error(err);
      } finally{
        setIsLoading(false)
      }
    };
    fetchUsers();
  }, [getAllUsers]);

  return (
    <div className="space-y-6 p-6">
      <Table columns={columns} data={mitraData} isLoading={isLoading} />
    </div>
  );
}
