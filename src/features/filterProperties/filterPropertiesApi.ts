import { IProperty } from "@/common/interfaces/property/property.interface";
import { http } from "@/services/http";

export const FilterPropertiesApi = {
  getByFilters: async (
    category?: string,
    agentId?: string,
    status?: string,
    contract?: string,
  ): Promise<IProperty[]> => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (agentId) params.append("agentId", agentId);
    if (status) params.append("status", status);
    if (contract) params.append("contract", contract);

    const { data } = await http.get(`/properties/filter?${params.toString()}`);
    return data;
  },
};
