import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import userApi from "@/lib/userApi";
import { UserResponse } from "@/interfaces/types";
import Table from "@/components/table";

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

  useEffect(() => {
    setIsLoading(true);
    userApi.getAllUsers()
      .then((users) => {
        setMitraData(users);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <Table columns={columns} data={mitraData} isLoading={isLoading}/>
    </div>
  );
}
