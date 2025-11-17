import { IProperty } from "@/common/interfaces/property/property.interface";
import { http } from "@/services/http";

export const PropertiesApi = {
  getAll: async (): Promise<IProperty[]> => {
    const { data } = await http.get("/properties");
    return data;
  },
  getById: async (id: string): Promise<IProperty> => {
    const { data } = await http.get(`/properties/${id}`);
    return data;
  },
  create: async (payload: IProperty): Promise<IProperty> => {
    const body = JSON.stringify(payload);
    const { data } = await http.post("/properties", body, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },
  getBySku: async (sku: string): Promise<IProperty | null> => {
    try {
      const { data } = await http.get("/properties");
      return data.find((p: IProperty) => p.sku === sku) || null;
    } catch (err) {
      console.error("Eroare la getBySku:", err);
      return null;
    }
  },
  uploadImages: async (id: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    return (
      await http.post(`/properties/${id}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  },

  uploadContract: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("contract", file);

    const { data } = await http.post(`/properties/${id}/contract`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};
