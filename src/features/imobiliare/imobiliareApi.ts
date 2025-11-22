import { IImobiliareLoginResponse } from "@/common/interfaces/responses/imobiliare-login-response.interface";
import { IImobiliareSlotsResponse } from "@/common/interfaces/responses/imobiliare-slot-response.interface";
import { http } from "@/services/http";

export const ImobiliareApi = {
  login: async (): Promise<IImobiliareLoginResponse> => {
    const { data } = await http.post<IImobiliareLoginResponse>("/imobiliare/login");
    return data;
  },

  getSlots: async (): Promise<IImobiliareSlotsResponse> => {
    const { data } = await http.get<IImobiliareSlotsResponse>("/imobiliare/slots");
    return data;
  },
};
