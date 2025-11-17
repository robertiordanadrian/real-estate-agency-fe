import { IOwner } from "@/common/interfaces/owner/owner.interface";
import { http } from "@/services/http";

export const OwnersApi = {
  getAll: async () => {
    const res = await http.get<IOwner[]>("/owners");
    return res.data;
  },

  create: async (payload: Omit<IOwner, "_id">) => {
    const res = await http.post<IOwner>("/owners", payload);
    return res.data;
  },

  getById: async (id: string) => {
    const res = await http.get<IOwner>(`/owners/${id}`);
    return res.data;
  },
};
