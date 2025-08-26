import { File } from "@/interfaces/types";
import axios from "./api";

async function unggahFileTemplate(file: File): Promise<File> {
  const response = await axios.post<{ data: File }>("/batashonor/upload", file);
  return response.data.data;
}

async function kirimFileTemplate(file: File): Promise<File> {
  const response = await axios.post<{ data: File }>("/kegiatanmitra/save", file);
  return response.data.data;
}

export default { unggahFileTemplate, kirimFileTemplate };
