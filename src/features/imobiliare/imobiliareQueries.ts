import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ImobiliareApi } from "@/features/imobiliare/imobiliareApi";

export const imobiliareKeys = {
  all: ["imobiliare"] as const,
  slots: ["imobiliare", "slots"] as const,
};

export const useImobiliareLogin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ImobiliareApi.login,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: imobiliareKeys.slots });
    },
  });
};

export const useImobiliareSlots = () =>
  useQuery({
    queryKey: imobiliareKeys.slots,
    queryFn: ImobiliareApi.getSlots,
    staleTime: 1000 * 60 * 10,
  });
