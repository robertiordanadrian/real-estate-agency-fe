import { http } from "@/services/http";
import { ILeadRequest } from "@/common/interfaces/lead/lead-request.interface";

export const LeadRequestsApi = {
  getPending: async (): Promise<ILeadRequest[]> => {
    const { data } = await http.get<ILeadRequest[]>("/lead-requests/pending");
    return data;
  },

  getArchive: async (): Promise<ILeadRequest[]> => {
    const { data } = await http.get<ILeadRequest[]>("/lead-requests/archive");
    return data;
  },

  approve: async (id: string): Promise<ILeadRequest> => {
    const { data } = await http.patch<ILeadRequest>(`/lead-requests/${id}/approve`);
    return data;
  },

  reject: async (id: string): Promise<ILeadRequest> => {
    const { data } = await http.patch<ILeadRequest>(`/lead-requests/${id}/reject`);
    return data;
  },
};
