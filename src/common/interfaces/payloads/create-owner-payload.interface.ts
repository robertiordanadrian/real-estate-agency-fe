import { EOwnerType } from "@/common/interfaces/owner/owner.interface";

export interface ICreateOwnerPayload {
  agentId: string;
  type: EOwnerType;

  surname?: string | null;
  lastname?: string | null;

  companyName?: string | null;
  cui?: string | null;
  representative?: string | null;

  phone: string;
  email?: string | null;
}
