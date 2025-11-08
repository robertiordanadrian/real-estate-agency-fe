import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { LeadRequestsApi } from "./leadRequestsApi";

export const leadRequestsKeys = {
  all: ["lead-requests"] as const,
  pending: () => [...leadRequestsKeys.all, "pending"] as const,
  archive: () => [...leadRequestsKeys.all, "archive"] as const,
};

export const usePendingLeadRequestsQuery = () =>
  useQuery({
    queryKey: leadRequestsKeys.pending(),
    queryFn: async () => {
      const { data } = await LeadRequestsApi.getPending();
      return data;
    },
  });

export const useArchiveLeadRequestsQuery = () =>
  useQuery({
    queryKey: leadRequestsKeys.archive(),
    queryFn: async () => {
      const { data } = await LeadRequestsApi.getArchive();
      return data;
    },
  });

export const useApproveLeadRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => LeadRequestsApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: leadRequestsKeys.pending(),
      });
    },
  });
};

export const useRejectLeadRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => LeadRequestsApi.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: leadRequestsKeys.pending(),
      });
    },
  });
};
