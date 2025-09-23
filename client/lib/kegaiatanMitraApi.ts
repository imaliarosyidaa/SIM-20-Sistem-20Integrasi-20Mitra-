import { File, Kegiatan, KegiatanMitraResponse } from "@/interfaces/types";
import axios from "./api";

async function unggahFileTemplate(access_token:string, file: File): Promise<File> {
  const response = await axios.post<{ data: File }>("/kegiatanmitra/upload", file,
    {
        headers: {
            'Content-Type': 'multipart/form-data',
            Accept: '*/*',
            Authorization: `Bearer ${access_token}`,
        },
        withCredentials: true,
    });
  return response.data.data;
}

async function kirimFileTemplate(access_token:string, file: File): Promise<File> {
  const response = await axios.post<{ data: File }>("/kegiatanmitra/save", file,
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

async function getKegiatanMitra(access_token:string): Promise<KegiatanMitraResponse[]> {
  const response = await axios.get<{data: KegiatanMitraResponse[]}>("/kegiatanmitra",
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

async function deleteKegiatanMitra(access_token:string, id: number): Promise<KegiatanMitraResponse> {
  const response = await axios.delete<{data: KegiatanMitraResponse}>("/kegiatanmitra/delete",
    {
        data:{id: id},
        headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            Authorization: `Bearer ${access_token}`,
        },
        withCredentials: true,
    });
  return response.data.data;
}

async function createKegiatanMitra(access_token:string, payload: KegiatanMitraResponse): Promise<KegiatanMitraResponse> {
  const response = await axios.post<{data: KegiatanMitraResponse}>("/kegiatanmitra",payload,
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

async function GetKegiatanById(access_token:string, id: number): Promise<any> {
  const response = await axios.get(`/kegiatanmitra/${id}`,
    {
        headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            Authorization: `Bearer ${access_token}`,
        },
        withCredentials: true,
    });
  return response.data;
}

async function GetJumlahKegiatanMitra(access_token:string, year: number): Promise<any> {
  const response = await axios.get(`/kegiatanmitra/count/${year}`,
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

export default { 
  unggahFileTemplate,
  kirimFileTemplate,
  getKegiatanMitra,
  deleteKegiatanMitra,
  createKegiatanMitra,
  GetKegiatanById,
  GetJumlahKegiatanMitra
};
