import { http } from "@/services/http";

export const ImobiliareApi = {
  login: async () => {
    const { data } = await http.post("/imobiliare/login");
    return data;
  },

  getSlots: async () => {
    const { data } = await http.get("/imobiliare/slots");
    return data as { name: string; total: number; used: number }[];
  },
};
