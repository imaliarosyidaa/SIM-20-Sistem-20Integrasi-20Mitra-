import { Kegiatan } from "@/interfaces/types";
import axios from "./api";

async function createKegiatan(newKegiatan: Kegiatan): Promise<Kegiatan> {
  const response = await axios.post<{ data: Kegiatan}>("/kegiatan", newKegiatan);
  return response.data.data;
}

export default { createKegiatan };
