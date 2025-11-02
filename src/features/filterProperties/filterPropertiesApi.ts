import { http } from "../../services/http";
import { IProperty } from "../../common/interfaces/property.interface";

export const FilterPropertiesApi = {
  getByFilters: async (
    category?: string,
    agentID?: string
  ): Promise<IProperty[]> => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (agentID) params.append("agentID", agentID);

    const { data } = await http.get(`/properties/filter?${params.toString()}`);
    return data;
  },
};
