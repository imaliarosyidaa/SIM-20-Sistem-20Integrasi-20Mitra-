import { Kegiatan, MatriksKegiatan } from "@/interfaces/types";
import axios from "./api";

async function createKegiatan(access_token: string, newKegiatan: Kegiatan): Promise<Kegiatan> {
  const response = await axios.post<{ data: Kegiatan}>("/kegiatan", newKegiatan,
    {
        headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            Authorization: `Bearer ${access_token}`,
        },
        withCredentials: true,
    });
  return response.data.data;
}

async function getMatriksKegiatan(access_token: string, selectedYear: number): Promise<MatriksKegiatan[]> {
  const response = await axios.get<MatriksKegiatan[]>(`/kegiatan/${selectedYear}`,
    {
        headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            Authorization: `Bearer ${access_token}`,
        },
        withCredentials: true,
    }
  );
  return response.data;
}
export default { createKegiatan, getMatriksKegiatan };
