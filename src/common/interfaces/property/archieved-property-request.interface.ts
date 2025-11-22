import { EStatus } from "@/common/enums/property/general-details.enums";

export interface IdRef {
  _id: string;
  name?: string;
}

export interface IArchivedPropertyRequest {
  _id: string;
  propertyId: string | IdRef;
  requestedBy: string | IdRef;
  requestedStatus: EStatus;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  approvedBy: string | null;
  rejectedBy: string | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}
