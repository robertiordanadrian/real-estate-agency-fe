import { IOwner } from "@/common/interfaces/owner/owner.interface";
import { ICreateOwnerPayload } from "@/common/interfaces/payloads/create-owner-payload.interface";
import { http } from "@/services/http";

export const OwnersApi = {
  getAll: async () => {
    const res = await http.get<IOwner[]>("/owners");
    return res.data;
  },

  getById: async (id: string) => {
    const res = await http.get<IOwner>(`/owners/${id}`);
    return res.data;
  },

  create: async (payload: ICreateOwnerPayload) => {
    const res = await http.post<IOwner>("/owners", payload);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await http.delete<{ deleted: boolean }>(`/owners/${id}`);
    return res.data;
  },
};
