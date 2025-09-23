import { File } from "@/interfaces/types";
import axios from "./api";

async function GetFiles(access_token: string): Promise<any> {
  const response = await axios.get<{ data: File }>("/files/list",
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

async function streamDoc(access_token:string, filename: string): Promise<any>{
      const response = await axios.get<{ data: File }>(`/files/stream/${filename}`,
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

export default { GetFiles,streamDoc };