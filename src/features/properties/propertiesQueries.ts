import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IProperty } from "@/common/interfaces/property/property.interface";
import { ICreatePropertyPayload } from "@/common/interfaces/payloads/create-property-payload.interface";
import { PropertiesApi } from "@/features/properties/propertiesApi";

export const propertiesKeys = {
  all: ["properties"] as const,
  byId: (id: string) => [...propertiesKeys.all, id] as const,
  bySku: (sku: string) => [...propertiesKeys.all, "sku", sku] as const,
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

export const usePropertyBySkuQuery = (sku: string) =>
  useQuery({
    queryKey: propertiesKeys.bySku(sku),
    queryFn: () => PropertiesApi.getBySku(sku),
    enabled: !!sku,
  });

export const useUpdateProperty = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IProperty }) => PropertiesApi.update(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: propertiesKeys.byId(vars.id) });
      qc.invalidateQueries({ queryKey: propertiesKeys.all });
    },
    onError: (err) => {
      console.error("❌ Eroare update proprietate:", err);
    },
  });
};

export const useCreateProperty = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreatePropertyPayload) => PropertiesApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: propertiesKeys.all });
    },
    onError: (err) => {
      console.error("❌ Eroare creare proprietate:", err);
    },
  });
};

export const useUploadPropertyImages = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, files }: { id: string; files: File[] }) =>
      PropertiesApi.uploadImages(id, files),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: propertiesKeys.byId(vars.id) });
      qc.invalidateQueries({ queryKey: propertiesKeys.all });
    },
    onError: (err) => {
      console.error("❌ Eroare upload imagini:", err);
    },
  });
};

export const useUploadPropertyContract = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      PropertiesApi.uploadContract(id, file),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: propertiesKeys.byId(vars.id) });
      qc.invalidateQueries({ queryKey: propertiesKeys.all });
    },
    onError: (err) => {
      console.error("❌ Eroare upload contract:", err);
    },
  });
};
