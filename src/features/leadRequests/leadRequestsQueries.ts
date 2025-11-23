import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { LeadRequestsApi } from "@/features/leadRequests/leadRequestsApi";
import { ILeadRequest } from "@/common/interfaces/lead/lead-request.interface";
import { useToast } from "@/context/ToastContext";
import type { AxiosError } from "axios";

export const leadRequestsKeys = {
  all: ["lead-requests"] as const,
  pending: () => [...leadRequestsKeys.all, "pending"] as const,
  archive: () => [...leadRequestsKeys.all, "archive"] as const,
};

export const usePendingLeadRequestsQuery = (
  options?: Omit<UseQueryOptions<ILeadRequest[], Error>, "queryKey" | "queryFn">,
) =>
  useQuery<ILeadRequest[]>({
    queryKey: leadRequestsKeys.pending(),
    queryFn: LeadRequestsApi.getPending,
    ...options,
  });

export const useArchiveLeadRequestsQuery = () =>
  useQuery<ILeadRequest[]>({
    queryKey: leadRequestsKeys.archive(),
    queryFn: LeadRequestsApi.getArchive,
  });

export const useApproveLeadRequest = () => {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation<ILeadRequest, AxiosError<{ message?: string }>, string>({
    mutationFn: LeadRequestsApi.approve,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: leadRequestsKeys.pending() });
      qc.invalidateQueries({ queryKey: leadRequestsKeys.archive() });
      toast("Cererea de lead a fost aprobată", "success");
    },
    onError: (error) => {
      console.error("❌ Error approving lead request:", error);
      toast(error.response?.data?.message || "Eroare la aprobarea cererii lead", "error");
    },
  });
};

export const useRejectLeadRequest = () => {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation<ILeadRequest, AxiosError<{ message?: string }>, string>({
    mutationFn: LeadRequestsApi.reject,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: leadRequestsKeys.pending() });
      qc.invalidateQueries({ queryKey: leadRequestsKeys.archive() });
      toast("Cererea de lead a fost respinsă", "success");
    },
    onError: (error) => {
      console.error("❌ Error rejecting lead request:", error);
      toast(error.response?.data?.message || "Eroare la respingerea cererii lead", "error");
    },
  });
};
