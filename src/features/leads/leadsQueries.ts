import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LeadsApi } from "./leadsApi";
import type { ILead } from "../../common/interfaces/lead.interface";

export const useLeadsQuery = () => {
  return useQuery<ILead[]>({
    queryKey: ["leads"],
    queryFn: LeadsApi.getAll,
    refetchInterval: 10000,
  });
};

export const useDeleteLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => LeadsApi.deleteLead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};
