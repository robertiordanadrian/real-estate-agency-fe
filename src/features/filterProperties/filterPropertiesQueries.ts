import { useQuery } from "@tanstack/react-query";
import { FilterPropertiesApi } from "./filterPropertiesApi";
import { IProperty } from "../../common/interfaces/property.interface";

export const useFilterPropertiesQuery = (category?: string, agentID?: string) =>
  useQuery<IProperty[]>({
    queryKey: ["filterProperties", category, agentID],
    queryFn: () => FilterPropertiesApi.getByFilters(category, agentID),
    enabled: !!agentID,
  });
