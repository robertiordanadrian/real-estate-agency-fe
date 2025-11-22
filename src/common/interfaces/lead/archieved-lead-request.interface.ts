export interface IArchivedLeadRequest {
  _id: string;
  leadId: string | IIdRef;
  requestedBy: string | IIdRef;
  requestedStatus: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  approvedBy: string | null;
  rejectedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IIdRef {
  _id: string;
  name?: string;
}
