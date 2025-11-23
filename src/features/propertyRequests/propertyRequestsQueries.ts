import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { PropertyRequestsApi } from "@/features/propertyRequests/propertyRequestsApi";
import { IPropertyRequest } from "@/common/interfaces/property/property-request.interface";
import { useToast } from "@/context/ToastContext";
import type { AxiosError } from "axios";

export const propertyRequestsKeys = {
  all: ["property-requests"] as const,
  pending: () => [...propertyRequestsKeys.all, "pending"] as const,
  archive: () => [...propertyRequestsKeys.all, "archive"] as const,
};

export const usePendingPropertyRequestsQuery = (
  options?: Omit<UseQueryOptions<IPropertyRequest[], Error>, "queryKey" | "queryFn">,
) =>
  useQuery<IPropertyRequest[]>({
    queryKey: propertyRequestsKeys.pending(),
    queryFn: PropertyRequestsApi.getPending,
    ...options,
  });

export const useArchivePropertyRequestsQuery = () =>
  useQuery<IPropertyRequest[]>({
    queryKey: propertyRequestsKeys.archive(),
    queryFn: PropertyRequestsApi.getArchive,
  });

export const useApproveRequest = () => {
  const qc = useQueryClient();
  const toast = useToast();

  return useMutation<IPropertyRequest, AxiosError<{ message?: string }>, string>({
    mutationFn: PropertyRequestsApi.approve,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: propertyRequestsKeys.pending() });
      qc.invalidateQueries({ queryKey: propertyRequestsKeys.archive() });
      toast("Cererea a fost aprobată cu succes", "success");
    },
    onError: (error) => {
      console.error("❌ Error approving property request:", error);
      toast(error.response?.data?.message || "Eroare la aprobarea cererii", "error");
    },
  });
};

export const useRejectRequest = () => {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation<IPropertyRequest, AxiosError<{ message?: string }>, string>({
    mutationFn: PropertyRequestsApi.reject,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: propertyRequestsKeys.pending() });
      qc.invalidateQueries({ queryKey: propertyRequestsKeys.archive() });
      toast("Cererea a fost respinsă", "success");
    },
    onError: (error) => {
      console.error("❌ Error rejecting property request:", error);
      toast(error.response?.data?.message || "Eroare la respingerea cererii", "error");
    },
  });
};
