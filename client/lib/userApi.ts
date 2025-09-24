import { useCallback } from "react";
import { User } from "@/interfaces/types";
import useAxiosPrivate from "../hooks/use-axios-private";

export default function useUserApi() {
  const axiosPrivate = useAxiosPrivate();

  const getAllUsers = useCallback(async (): Promise<User[]> => {
    const controller =  new AbortController();
    
    const response = await axiosPrivate.get<{ data: User[] }>("/mitra", {
      signal: controller.signal
    });
    return response.data.data;
  }, [axiosPrivate]);

  return { getAllUsers };
}
