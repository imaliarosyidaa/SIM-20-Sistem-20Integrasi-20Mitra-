import { File, Kegiatan, KegiatanMitraResponse } from "@/interfaces/types";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { useCallback } from "react";

export default function useKegiatanMitraApi(){
  const axiosPrivate = useAxiosPrivate()
  
  const unggahFileTemplate = useCallback( async (file: File): Promise<File> => {
    const controller = new AbortController();
    
    const response = await axiosPrivate.post<{ data: File }>("/kegiatanmitra/upload", file,
        {signal: controller.signal,
          headers: { "Content-Type": "multipart/form-data",Accept: '*/*', }
        }
      );
  return response.data.data;
  },[axiosPrivate])

  const kirimFileTemplate = useCallback( async(file: File): Promise<File> =>{
    const controller = new AbortController();

    const response = await axiosPrivate.post<{ data: File }>("/kegiatanmitra/save", file,
    {
      signal : controller.signal,
    });
  return response.data.data;
  },[axiosPrivate])

  const getKegiatanMitra = useCallback( async(year:number, month:string, tim:string): Promise<KegiatanMitraResponse[]> => {
  const controller = new AbortController();

    const response = await axiosPrivate.get<{data: KegiatanMitraResponse[]}>(`/kegiatanmitra?year=${year}&month=${month}&tim=${tim}`,
    {
      signal: controller.signal
    });
  return response.data.data;
  },[axiosPrivate])

  const deleteKegiatanMitra = useCallback( async(id: number): Promise<KegiatanMitraResponse>=> {
    const controller = new AbortController();

      const response = await axiosPrivate.delete<{data: KegiatanMitraResponse}>("/kegiatanmitra/delete",
    {
        data:{id: id},
        signal: controller.signal
    });
  return response.data.data;
  },[axiosPrivate])

  const createKegiatanMitra = useCallback( async(payload: KegiatanMitraResponse): Promise<KegiatanMitraResponse> =>{
    const controller = new AbortController()

    const response = await axiosPrivate.post<{data: KegiatanMitraResponse}>("/kegiatanmitra",payload,
    {
      signal: controller.signal
    });
  return response.data.data;
  },[axiosPrivate])

  const getKegiatanById = useCallback(async(id: number,year:number, month:string): Promise<any>=>{
    const controller = new AbortController()
    const response = await axiosPrivate.get(`/kegiatanmitra/${id}?year=${year}&month=${month}`,
    {
      signal : controller.signal
    });
  return response.data;
  },[axiosPrivate])

  const getJumlahKegiatanMitra = useCallback(async(year:number): Promise<any>=>{
    const controller = new AbortController();
    const response = await axiosPrivate.get(`/kegiatanmitra/count/${year}`,
      {
        signal: controller.signal
      });
    return response.data.data;

  },[axiosPrivate])

  
  const getRincianKegiatanMitra = useCallback( async(year:number, month:string, idSobat:string): Promise<any> => {
  const controller = new AbortController();

    const response = await axiosPrivate.get(`/kegiatanmitra/count?year=${year}&month=${month}&idSobat=${idSobat}`,
    {
      signal: controller.signal
    }
  );
  return response.data.data;
  },[axiosPrivate])

  return {
    unggahFileTemplate,
    kirimFileTemplate,
    getKegiatanMitra,
    deleteKegiatanMitra,
    createKegiatanMitra,
    getKegiatanById,
    getJumlahKegiatanMitra,
    getRincianKegiatanMitra
  }
}
