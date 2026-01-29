import useAxiosPrivate from "@/hooks/use-axios-private";
import { useCallback } from "react";


export default function filterApi(){
  const axiosPrivate = useAxiosPrivate()
  
  const getTahun = useCallback( async (): Promise<any> => {
    const controller = new AbortController();
    
    const response = await axiosPrivate.get("/filters/year",
      {
        signal: controller.signal
      }
    );
    return response.data.data;
  },[axiosPrivate])

  return {
    getTahun
  }
}