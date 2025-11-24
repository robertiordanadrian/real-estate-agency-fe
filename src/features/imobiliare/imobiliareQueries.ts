import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IImobiliareLoginResponse } from "@/common/interfaces/responses/imobiliare-login-response.interface";
import { IImobiliareSlotsResponse } from "@/common/interfaces/responses/imobiliare-slot-response.interface";
import { ImobiliareApi } from "@/features/imobiliare/imobiliareApi";

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
