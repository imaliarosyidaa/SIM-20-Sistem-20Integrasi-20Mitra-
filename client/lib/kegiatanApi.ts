import { Kegiatan, MatriksKegiatan } from "@/interfaces/types";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { useCallback } from "react";

export default function useKegiatanApi(){
  const axiosPrivate = useAxiosPrivate();


  const createKegiatan = useCallback(async (newKegiatan: Kegiatan): Promise<any> =>{
    const controller = new AbortController();

    const response = await axiosPrivate.post<{data: Kegiatan}>("/kegiatan", newKegiatan,{
      signal: controller.signal
    })

    return response.data.data;
  },[axiosPrivate])
  
  const getMatriksKegiatan = useCallback(async (selectedYear: number): Promise<any> =>{
    const controller = new AbortController();

    const response = await axiosPrivate.get<MatriksKegiatan[]>(`/kegiatan/${selectedYear}`,{
      signal: controller.signal
    })

    return response.data;
  },[axiosPrivate])

  return {createKegiatan, getMatriksKegiatan}
}