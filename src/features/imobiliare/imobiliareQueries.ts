import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ImobiliareApi } from "@/features/imobiliare/imobiliareApi";
import { IImobiliareSlotsResponse } from "@/common/interfaces/responses/imobiliare-slot-response.interface";
import { IImobiliareLoginResponse } from "@/common/interfaces/responses/imobiliare-login-response.interface";

export const imobiliareKeys = {
  all: ["imobiliare"] as const,
  slots: ["imobiliare", "slots"] as const,
};

export const useImobiliareLogin = () => {
  const qc = useQueryClient();
  return useMutation<IImobiliareLoginResponse>({
    mutationFn: ImobiliareApi.login,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: imobiliareKeys.slots });
    },
    onError: (error) => {
      console.error("❌ Error logging into Imobiliare.ro:", error);
    },
  });
};

export const useImobiliareSlots = () =>
  useQuery<IImobiliareSlotsResponse>({
    queryKey: imobiliareKeys.slots,
    queryFn: ImobiliareApi.getSlots,
    staleTime: 1000 * 60 * 10,
  });
