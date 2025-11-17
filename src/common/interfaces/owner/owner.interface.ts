export enum EOwnerType {
  PF = "pf",
  PJ = "pj",
}
export interface IOwner {
  _id?: string;
  id?: string;
  agentId: string | null;
  createdAt?: string;
  updatedAt?: string;
  type: EOwnerType | null;
  surname: string | null;
  lastname: string | null;
  companyName: string | null;
  cui: string | null;
  phone: string | null;
  representative: string | null;
  email: string | null;
}
