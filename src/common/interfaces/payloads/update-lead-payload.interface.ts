import { ELeadStatus } from "@/common/enums/lead/lead-status.enum";

export interface IUpdateLeadPayload {
  name?: string;
  phoneNumber?: string;
  propertyType?: string;
  zona?: string;
  budget?: string;
  transactionType?: string;
  idSeries?: string;
  idNumber?: string;
  cnp?: string;
  idExpirationDate?: string;
  address?: string;
  status?: ELeadStatus;
  agentId?: string;
}
