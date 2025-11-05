import { http } from "../../services/http";

export const PropertyRequestsApi = {
  getPending: () => http.get("/property-requests/pending"),
  approve: (id: string) => http.patch(`/property-requests/${id}/approve`),
  reject: (id: string) => http.patch(`/property-requests/${id}/reject`),
};
