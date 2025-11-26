import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ICreatePropertyPayload } from "@/common/interfaces/payloads/create-property-payload.interface";
import { IGetPropertiesByFilterPayload } from "@/common/interfaces/payloads/get-properties-by-filter-payload.interface";
import { IProperty } from "@/common/interfaces/property/property.interface";
import { PropertiesApi } from "@/features/properties/propertiesApi";

export const propertiesKeys = {
  byId: (id: string) => ["id", id] as const,
  bySku: (sku: string) => ["sku", sku] as const,
  filterRoot: ["filterProperties"] as const,
  filter: (filters: IGetPropertiesByFilterPayload) => ["filterProperties", filters] as const,
};

export const useFilterPropertiesQuery = (filters: IGetPropertiesByFilterPayload) =>
  useQuery<IProperty[]>({
    queryKey: propertiesKeys.filter(filters),
    queryFn: () => PropertiesApi.getByFilters(filters),
    enabled: !!filters.agentId,
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
      qc.invalidateQueries({
        queryKey: propertiesKeys.filterRoot,
        exact: false,
      });
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
      qc.invalidateQueries({
        queryKey: propertiesKeys.filterRoot,
        exact: false,
      });
    },
    onError: (err) => {
      console.error("❌ Eroare creare proprietate:", err);
    },
  });
};

export const useDownloadWatermarkedImages = () => {
  return useMutation({
    mutationFn: (id: string) => PropertiesApi.downloadWatermarkedImages(id),
    onError: (err) => console.error("❌ Eroare download watermark:", err),
  });
};

export const useUploadPropertyImages = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, files }: { id: string; files: File[] }) =>
      PropertiesApi.uploadImages(id, files),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: propertiesKeys.byId(vars.id) });
      qc.invalidateQueries({
        queryKey: propertiesKeys.filterRoot,
        exact: false,
      });
    },
    onError: (err) => {
      console.error("❌ Eroare upload imagini:", err);
    },
  });
};

export const useDeletePropertyImages = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, urls }: { id: string; urls: string[] }) =>
      PropertiesApi.deleteImages(id, urls),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: propertiesKeys.byId(vars.id) });
      qc.invalidateQueries({
        queryKey: propertiesKeys.filterRoot,
        exact: false,
      });
    },
    onError: (err) => {
      console.error("❌ Eroare delete imagini:", err);
    },
  });
};

export const useUpdateImagesOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, images }: { id: string; images: string[] }) =>
      PropertiesApi.updateImagesOrder(id, images),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: propertiesKeys.byId(vars.id) });
      qc.invalidateQueries({
        queryKey: propertiesKeys.filterRoot,
        exact: false,
      });
    },
    onError: (err) => {
      console.error("❌ Eroare update order imagini:", err);
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
      qc.invalidateQueries({
        queryKey: propertiesKeys.filterRoot,
        exact: false,
      });
    },
    onError: (err) => {
      console.error("❌ Eroare upload contract:", err);
    },
  });
};
