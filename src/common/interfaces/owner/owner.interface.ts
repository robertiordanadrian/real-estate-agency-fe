export enum EOwnerType {
  PF = "pf",
  PJ = "pj",
}
export interface IOwner {
  _id: string;
  agentId: string;
  createdAt: string;
  updatedAt: string;
  type: EOwnerType | null;
  surname: string;
  lastname: string;
  companyName: string;
  cui: string;
  phone: string;
  representative: string;
  email: string;
}
