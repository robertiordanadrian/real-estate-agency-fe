import { ELeadStatus } from "@/common/enums/lead/lead-status.enum";

export interface ILead {
  _id?: string;
  callSid: string;
  phoneNumber: string;
  name: string;
  propertyType: string;
  zona: string;
  budget: string;
  transactionType: string;
  sku: string;
  recordingUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  agentId?: string;
  contractUrl?: string;
  status: ELeadStatus;
  idSeries?: string;
  idNumber?: string;
  cnp?: string;
  idExpirationDate?: string;
  address?: string;
}
