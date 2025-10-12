import type { IOwner } from "../common/interfaces/owner.interface";
import axiosClient from "./axiosClient";

export const OwnersApi = {
  async getByAgent(agentId: string): Promise<IOwner[]> {
    const res = await axiosClient.get<IOwner[]>("/owners", {
      params: { agentId },
    });
    return res.data;
  },

  async create(
    payload: Omit<IOwner, "_id" | "createdAt" | "updatedAt">
  ): Promise<IOwner> {
    const res = await axiosClient.post<IOwner>("/owners", payload);
    return res.data;
  },

  async remove(id: string): Promise<{ deleted: boolean }> {
    const res = await axiosClient.delete<{ deleted: boolean }>(`/owners/${id}`);
    return res.data;
  },
};
