import { http } from "../../services/http";
import type { ILead } from "../../common/interfaces/lead.interface";

export const LeadsApi = {
  async getAll(): Promise<ILead[]> {
    const { data } = await http.get<ILead[]>("/leads");
    return data;
  },
};
