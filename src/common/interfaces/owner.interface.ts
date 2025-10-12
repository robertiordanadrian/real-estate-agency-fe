export interface IOwner {
  _id: string;
  agentId: string;
  surname: string;
  lastname: string;
  email: string;
  phone: string;
  companyWhereHeWorks: string;
  tags: string[];
  memo: string;
  createdAt?: string;
  updatedAt?: string;
}
