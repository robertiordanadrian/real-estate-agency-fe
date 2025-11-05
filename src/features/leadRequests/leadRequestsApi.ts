import { http } from "../../services/http";

export const LeadRequestsApi = {
  getPending: () => http.get("/lead-requests/pending"),
  approve: (id: string) => http.patch(`/lead-requests/${id}/approve`),
  reject: (id: string) => http.patch(`/lead-requests/${id}/reject`),
};
