import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ILead } from "@/common/interfaces/lead/lead.interface";
import { LeadsApi } from "@/features/leads/leadsApi";

export const useLeadsQuery = () =>
  useQuery({
    queryKey: ["leads"],
    queryFn: LeadsApi.getAll,
  });

export const useLeadQuery = (id: string) =>
  useQuery({
    queryKey: ["lead", id],
    queryFn: () => LeadsApi.getOne(id),
    enabled: !!id,
  });

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ILead> }) => LeadsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};

export const useUploadContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => LeadsApi.uploadContract(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: LeadsApi.deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};
