import { File } from "@/interfaces/types";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { useCallback } from "react";


export default function useHonorApi(){
  const axiosPrivate = useAxiosPrivate()
  
  const batasHonorBulanan = useCallback( async (): Promise<any> => {
    const controller = new AbortController();
    
  const response = await axiosPrivate.get<{ data: File }>("/batashonor",
    {
      signal: controller.signal
    }
  );
  return response.data.data;
  },[axiosPrivate])

  const getRincianHonor = useCallback( async(year: number): Promise<File> =>{
    const controller = new AbortController();
      const response = await axiosPrivate.get<{ data: File }>(`/honormitra?year=${year}`,
    {
        signal: controller.signal
    }
  );
  return response.data.data;
  },[axiosPrivate])

  const getRekapHonorPerBulan = useCallback( async(selectedYear:number): Promise<any> => {
  const controller = new AbortController();

    const response = await axiosPrivate.get<{ data: File }>(`/honormitra/rekap/${selectedYear}`,
    {
      signal: controller.signal
    }
  );
  return response.data.data;
  },[axiosPrivate])

  const getHonorTop10 = useCallback( async(year:number, month:string): Promise<any> => {
  const controller = new AbortController();

    const response = await axiosPrivate.get(`/honormitra/kegiatan?year=${year}&month=${month}`,
    {
      signal: controller.signal
    }
  );
  return response.data.data;
  },[axiosPrivate])

  return {
    batasHonorBulanan, 
    getRincianHonor, 
    getRekapHonorPerBulan,
    getHonorTop10
  }
}
