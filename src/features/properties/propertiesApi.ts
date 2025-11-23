import { IProperty } from "@/common/interfaces/property/property.interface";
import { ICreatePropertyPayload } from "@/common/interfaces/payloads/create-property-payload.interface";
import { http } from "@/services/http";
import { IGetPropertiesByFilterPayload } from "@/common/interfaces/payloads/get-properties-by-filter-payload.interface";

export const PropertiesApi = {
  getByFilters: async (payload: IGetPropertiesByFilterPayload): Promise<IProperty[]> => {
    const params = new URLSearchParams();
    if (payload.category) params.append("category", payload.category);
    if (payload.agentId) params.append("agentId", payload.agentId);
    if (payload.status) params.append("status", payload.status);
    if (payload.contract) params.append("contract", payload.contract);
    const { data } = await http.get<IProperty[]>(`/properties/filter?${params.toString()}`);
    return data;
  },

  getById: async (id: string): Promise<IProperty> => {
    const { data } = await http.get(`/properties/id/${id}`);
    return data;
  },

  create: async (payload: ICreatePropertyPayload): Promise<IProperty> => {
    const { data } = await http.post("/properties", payload);
    return data;
  },

  update: async (id: string, payload: IProperty): Promise<IProperty> => {
    const { data } = await http.put(`/properties/${id}`, payload);
    return data;
  },

  getBySku: async (sku: string): Promise<IProperty | null> => {
    try {
      const { data } = await http.get(`/properties/sku/${sku}`);
      return data;
    } catch (err) {
      console.error("Eroare la getBySku:", err);
      return null;
    }
  },

  uploadImages: async (id: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    const { data } = await http.post(`/properties/${id}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  deleteImages: async (id: string, urls: string[]) => {
    const { data } = await http.delete(`/properties/${id}/images`, {
      data: { urls },
    });
    return data;
  },

  updateImagesOrder: async (id: string, images: string[]) => {
    const { data } = await http.put(`/properties/${id}/images/order`, { images });
    return data;
  },

  uploadContract: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("contract", file);
    const { data } = await http.post(`/properties/${id}/contract`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
};
