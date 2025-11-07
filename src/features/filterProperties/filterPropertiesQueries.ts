import { useQuery } from "@tanstack/react-query";
import { FilterPropertiesApi } from "./filterPropertiesApi";
import { IProperty } from "../../common/interfaces/property.interface";

export const useFilterPropertiesQuery = (
  category?: string,
  agentId?: string,
  status?: string,
  contract?: string
) =>
  useQuery<IProperty[]>({
    queryKey: ["filterProperties", category, agentId, status, contract],
    queryFn: () =>
      FilterPropertiesApi.getByFilters(category, agentId, status, contract),
    enabled: !!agentId,
  });
