import { File, Kegiatan, KegiatanMitraResponse } from "@/interfaces/types";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { useCallback } from "react";

export default function useFilesApi(){
  const axiosPrivate = useAxiosPrivate()
  
  const getFiles = useCallback( async (): Promise<any> => {
    const controller = new AbortController();
    
  const response = await axiosPrivate.get<{ data: File }>("/files/list",
    {
      signal : controller.signal
    }
  );
  return response.data;
  },[axiosPrivate])

  const streamDoc = useCallback( async(filename: string): Promise<any> =>{
    const controller = new AbortController();

      const response = await axiosPrivate.get<{ data: File }>(`/files/stream/${filename}`,
    {
      signal : controller.signal
    }
  );
  return response.data;
  },[axiosPrivate])
  
  return {
    getFiles,
    streamDoc,
  }
}