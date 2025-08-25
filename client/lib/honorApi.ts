import { BatasHonor } from "@/interfaces/types";
import axios from "./api";

async function getBatasHonor() {
  const response = await axios.get<{ data: BatasHonor[] }>("/batashonor");
  return response.data.data;
}

export default { getBatasHonor };
