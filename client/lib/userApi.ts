import { PenilaianMitra, UserResponse, User } from "@/interfaces/types";
import axios from "./api";

async function getAllUsers() {
  const response = await axios.get<{ data: User[] }>("/mitra");
  return response.data.data; // hasilnya { status_code, message, data: [] }
}

export default { getAllUsers };
