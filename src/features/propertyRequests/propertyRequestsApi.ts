import { IPropertyRequest } from "@/common/interfaces/property/property-request.interface";
import { http } from "@/services/http";

export const PropertyRequestsApi = {
  getPending: async (): Promise<IPropertyRequest[]> => {
    const { data } = await http.get<IPropertyRequest[]>("/property-requests/pending");
    return data;
  },

  getArchive: async (): Promise<IPropertyRequest[]> => {
    const { data } = await http.get<IPropertyRequest[]>("/property-requests/archive");
    return data;
  },

  approve: async (id: string): Promise<IPropertyRequest> => {
    const { data } = await http.patch<IPropertyRequest>(`/property-requests/${id}/approve`);
    return data;
  },

  reject: async (id: string): Promise<IPropertyRequest> => {
    const { data } = await http.patch<IPropertyRequest>(`/property-requests/${id}/reject`);
    return data;
  },
};
