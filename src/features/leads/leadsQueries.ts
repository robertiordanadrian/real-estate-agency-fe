import { useQuery } from "@tanstack/react-query";
import type { ILead } from "../../common/interfaces/lead.interface";
import { LeadsApi } from "./leadsApi";

export const useLeadsQuery = () => {
  return useQuery<ILead[]>({
    queryKey: ["leads"],
    queryFn: LeadsApi.getAll,
    refetchInterval: 10000,
  });
};
