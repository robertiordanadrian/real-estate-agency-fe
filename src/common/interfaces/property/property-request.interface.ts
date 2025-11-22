import { EStatus } from "@/common/enums/property/general-details.enums";
import { ERole } from "@/common/enums/role/role.enums";

export interface IPropertyRequest {
  _id: string;
  propertyId: string;
  requestedBy: string;
  requestedStatus: EStatus;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  approverRole: ERole;
  approvedBy: string | null;
  rejectedBy: string | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}
