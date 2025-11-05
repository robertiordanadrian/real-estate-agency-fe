import { useQuery } from "@tanstack/react-query";
import { FilterPropertiesApi } from "./filterPropertiesApi";
import { IProperty } from "../../common/interfaces/property.interface";

export const useFilterPropertiesQuery = (category?: string, agentId?: string) =>
  useQuery<IProperty[]>({
    queryKey: ["filterProperties", category, agentId],
    queryFn: () => FilterPropertiesApi.getByFilters(category, agentId),
    enabled: !!agentId,
  });
