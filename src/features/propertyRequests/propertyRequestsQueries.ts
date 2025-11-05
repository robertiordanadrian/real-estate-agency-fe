import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PropertyRequestsApi } from "./propertyRequestsApi";

export const propertyRequestsKeys = {
  all: ["property-requests"] as const,
  pending: () => [...propertyRequestsKeys.all, "pending"] as const,
};

export const usePendingRequestsQuery = () =>
  useQuery({
    queryKey: propertyRequestsKeys.pending(),
    queryFn: async () => {
      const { data } = await PropertyRequestsApi.getPending();
      return data;
    },
  });

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PropertyRequestsApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: propertyRequestsKeys.pending(),
      });
    },
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PropertyRequestsApi.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: propertyRequestsKeys.pending(),
      });
    },
  });
};
