import { File } from "@/interfaces/types";
import axios from "./api";

async function BatasHonorBulanan(access_token: string): Promise<any> {
  const response = await axios.get<{ data: File }>("/batashonor",
    {
        headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            Authorization: `Bearer ${access_token}`,
        },
        withCredentials: true,
    }
  );
  return response.data.data;
}

async function GetRincianHonor(access_token: string): Promise<any> {
  const response = await axios.get<{ data: File }>("/honormitra",
    {
        headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            Authorization: `Bearer ${access_token}`,
        },
        withCredentials: true,
    }
  );
  return response.data.data;
}

async function GetRekapHonorPerBulan(access_token: string, selectedYear:number): Promise<any> {
  const response = await axios.get<{ data: File }>(`/honormitra/rekap/${selectedYear}`,
    {
        headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            Authorization: `Bearer ${access_token}`,
        },
        withCredentials: true,
    }
  );
  return response.data.data;
}

export default { BatasHonorBulanan, GetRincianHonor, GetRekapHonorPerBulan };
