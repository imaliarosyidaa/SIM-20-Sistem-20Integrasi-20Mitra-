import { useCallback } from "react";
import { User } from "@/interfaces/types";
import useAxiosPrivate from "../hooks/use-axios-private";

export default function useUserApi() {
  const axiosPrivate = useAxiosPrivate();

  const getAllUsers = useCallback(async (): Promise<User[]> => {
    const controller = new AbortController();

    const response = await axiosPrivate.get<{ data: User[] }>("/mitra", {
      signal: controller.signal,
    });
    return response.data.data;
  }, [axiosPrivate]);

  // ================= UPDATE USER =================
  const updateUser = async (id: string, data: any) => {
    const response = await axiosPrivate.put(`/mitra/${id}`, data);
    return response.data;
  };

  // ================= DELETE USER =================
  const deleteUser = async (id: string) => {
    const response = await axiosPrivate.delete(`/mitra/${id}`);
    return response.data;
  };

  // ================= UPLOAD FILE =================
  const uploadMitraFile = async (formData: FormData) => {
    const response = await axiosPrivate.post("/mitra/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  };

  return {
    getAllUsers,
    updateUser,
    deleteUser,
    uploadMitraFile,
  };
}
