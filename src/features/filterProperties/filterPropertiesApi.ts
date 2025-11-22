import { IGetPropertiesByFilterPayload } from "@/common/interfaces/payloads/get-properties-by-filter-payload.interface";
import { IProperty } from "@/common/interfaces/property/property.interface";
import { http } from "@/services/http";

export const FilterPropertiesApi = {
  getByFilters: async (payload: IGetPropertiesByFilterPayload): Promise<IProperty[]> => {
    const params = new URLSearchParams();
    if (payload.category) params.append("category", payload.category);
    if (payload.agentId) params.append("agentId", payload.agentId);
    if (payload.status) params.append("status", payload.status);
    if (payload.contract) params.append("contract", payload.contract);
    const { data } = await http.get<IProperty[]>(`/properties/filter?${params.toString()}`);
    return data;
  },
};
