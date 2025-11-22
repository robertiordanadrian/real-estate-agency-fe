import { useQuery } from "@tanstack/react-query";

import { IProperty } from "@/common/interfaces/property/property.interface";
import { FilterPropertiesApi } from "@/features/filterProperties/filterPropertiesApi";
import { IGetPropertiesByFilterPayload } from "@/common/interfaces/payloads/get-properties-by-filter-payload.interface";

export const useFilterPropertiesQuery = (filters: IGetPropertiesByFilterPayload) =>
  useQuery<IProperty[]>({
    queryKey: ["filterProperties", filters],
    queryFn: () => FilterPropertiesApi.getByFilters(filters),
    enabled: !!filters.agentId,
  });
