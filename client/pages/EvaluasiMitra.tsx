import React, { useState, useEffect, useMemo, useCallback } from "react";
import userApi from "@/lib/userApi";
import Table from "@/components/table";
import { PenilaianMitra, User } from "@/interfaces/types";

export const columns = [
  {
    accessor: "id",
    Header: "No.",
  },
  {
    accessor: "nama",
    Header: "Nama Lengkap",
  },
  {
    Header: "Penilaian",
  },
]

export default function EvaluasiMitra() {
  const [mitraData, setMitraData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    userApi.getAllUsers().then((users) => {
      const filtered = users.map(user => ({
        id: user.id,
        nama: user.namaLengkap,
      }));
      setMitraData(filtered)
    })
      .catch((err) => { setError(true) })
      .finally(() => { setIsLoading(false) })
  }, []);
  
  return (
    <div className="space-y-6">
      <Table columns={columns} data={mitraData} isLoading={isLoading}/>
    </div>
  );
}