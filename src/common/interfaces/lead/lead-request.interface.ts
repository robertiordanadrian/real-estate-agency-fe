import { ERole } from "@/common/enums/role/role.enums";

export interface ILeadRequest {
  _id: string;
  leadId: string;
  requestedBy: string;
  requestedStatus: "VERDE" | "GALBEN" | "ALB" | "ROSU";
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  approverRole: ERole;
  approvedBy: string | null;
  rejectedBy: string | null;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
}
