import { ELeadStatus } from "common/enums/lead-status.enum";

export interface IEditLeadForm {
  name: string;
  phoneNumber: string;
  propertyType: string;
  zona: string;
  budget: string;
  transactionType: string;
  status?: ELeadStatus;
  agentId?: string;
  idSeries?: string;
  idNumber?: string;
  cnp?: string;
  idExpirationDate?: string;
  address?: string;
}
