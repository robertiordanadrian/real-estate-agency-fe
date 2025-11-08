import type { ILead } from "../../common/interfaces/lead.interface";
import { http } from "../../services/http";

export const LeadsApi = {
  async getAll(): Promise<ILead[]> {
    const { data } = await http.get<ILead[]>("/leads");
    return data;
  },

  async getOne(id: string): Promise<ILead> {
    const { data } = await http.get<ILead>(`/leads/${id}`);
    return data;
  },

  async update(id: string, data: Partial<ILead>): Promise<ILead> {
    const { data: updated } = await http.patch<ILead>(`/leads/${id}`, data);
    return updated;
  },

  async uploadContract(id: string, file: File): Promise<ILead> {
    const formData = new FormData();
    formData.append("contract", file);
    const { data } = await http.post<ILead>(`/leads/${id}/contract`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async deleteLead(id: string): Promise<void> {
    await http.delete(`/leads/${id}`);
  },
};
