import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PropertiesApi } from "./propertiesApi";
import { IProperty } from "../../common/interfaces/property.interface";

export const propertiesKeys = {
  all: ["properties"] as const,
  byId: (id: string) => [...propertiesKeys.all, id] as const,
};

export const usePropertiesQuery = () =>
  useQuery({
    queryKey: propertiesKeys.all,
    queryFn: PropertiesApi.getAll,
  });

export const usePropertyQuery = (id: string) =>
  useQuery({
    queryKey: propertiesKeys.byId(id),
    queryFn: () => PropertiesApi.getById(id),
    enabled: !!id,
  });

export const useCreateProperty = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: IProperty) => PropertiesApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: propertiesKeys.all });
    },
  });
};
