import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ILead } from "@/common/interfaces/lead/lead.interface";
import type { IUpdateLeadPayload } from "@/common/interfaces/payloads/update-lead-payload.interface";
import type { IDeleteLeadResponse } from "@/common/interfaces/responses/delete-lead-response.interface";
import { LeadsApi } from "@/features/leads/leadsApi";

export const leadsKeys = {
  all: ["leads"] as const,
  list: ["leads", "list"] as const,
  unseenCount: ["leads", "unseenCount"] as const,
};

export const useLeadsQuery = () =>
  useQuery<ILead[]>({
    queryKey: leadsKeys.list,
    queryFn: LeadsApi.getAll,
  });

export const useUnseenLeadsCount = (enabled: boolean) =>
  useQuery<{ count: number }>({
    queryKey: leadsKeys.unseenCount,
    queryFn: LeadsApi.getUnseenCount,
    refetchInterval: 60_000,
    enabled,
  });

export const useMarkVisibleLeadsAsSeen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: LeadsApi.markVisibleAsSeen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadsKeys.unseenCount });
    },
  });
};

export const useLeadQuery = (id: string) =>
  useQuery<ILead>({
    queryKey: ["lead", id],
    queryFn: () => LeadsApi.getOne(id),
    enabled: !!id,
  });

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateLeadPayload }) =>
      LeadsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead", id] });
    },
    onError: (error) => {
      console.error("❌ Error updating lead:", error);
    },
  });
};

export const useUploadContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => LeadsApi.uploadContract(id, file),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead", id] });
    },
    onError: (error) => {
      console.error("❌ Error uploading contract:", error);
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string): Promise<IDeleteLeadResponse> => LeadsApi.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (error) => {
      console.error("❌ Error deleting lead:", error);
    },
  });
};
