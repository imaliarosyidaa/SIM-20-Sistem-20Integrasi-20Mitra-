import { File, KeuanganForm, KeuanganUpdateBendahara, KeuanganUpdatePPK, KeuanganUpdatePPSPM, KeuanganUpdateUmum } from "@/interfaces/types";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { useCallback } from "react";


export default function useKeuanganApi(){
  const axiosPrivate = useAxiosPrivate()
  
  const getAllKeuangan = useCallback( async (): Promise<any> => {
    const controller = new AbortController();
    
  const response = await axiosPrivate.get("/keuangan",
    {
      signal: controller.signal
    }
  );
  return response.data.data;
  },[axiosPrivate])

  const createKeuangan = useCallback( async(data: KeuanganForm): Promise<KeuanganForm> =>{
    const controller = new AbortController();
      const response = await axiosPrivate.post("/keuangan",data,
    {
        signal: controller.signal
    }
  );
  return response.data.data;
  },[])

  const updateByPPK = useCallback( async(id:number, data: KeuanganUpdatePPK): Promise<any> => {
  const controller = new AbortController();

    const response = await axiosPrivate.put(`/keuangan/ppk/${id}`,data,
    {
      signal: controller.signal
    }
  );
  return response.data.data;
  },[axiosPrivate])

  const updateByPPSPM = useCallback( async(id:number, data: KeuanganUpdatePPSPM): Promise<any> => {
  const controller = new AbortController();

    const response = await axiosPrivate.put(`/keuangan/ppspm/${id}`,data,
    {
      signal: controller.signal
    }
  );
  return response.data.data;
  },[axiosPrivate])

    const updateByBendahara = useCallback( async(id:number, data: KeuanganUpdateBendahara): Promise<any> => {
  const controller = new AbortController();

    const response = await axiosPrivate.put(`/keuangan/bendahara/${id}`,data,
    {
      signal: controller.signal
    }
  );
  return response.data.data;
  },[axiosPrivate])

  const updateByUmum = useCallback( async(id:number, data: KeuanganUpdateUmum): Promise<any> => {
  const controller = new AbortController();

    const response = await axiosPrivate.put(`/keuangan/umum/${id}`,data,
    {
      signal: controller.signal
    }
  );
  return response.data.data;
  },[axiosPrivate])

  return {
    getAllKeuangan, 
    createKeuangan, 
    updateByPPK,
    updateByPPSPM,
    updateByBendahara,
    updateByUmum
  }
}
