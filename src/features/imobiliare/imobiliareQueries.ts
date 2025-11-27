import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IImobiliareLoginResponse } from "@/common/interfaces/responses/imobiliare-login-response.interface";
import { IImobiliareSlotsResponse } from "@/common/interfaces/responses/imobiliare-slot-response.interface";
import { ImobiliareApi } from "@/features/imobiliare/imobiliareApi";
import { IImobiliareFlatLocation } from "@/common/interfaces/imobiliare/imobiliare.interface";

export const imobiliareKeys = {
  all: ["imobiliare"] as const,
  slots: ["imobiliare", "slots"] as const,
  locations: ["imobiliare", "locations"] as const,
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

export const useImobiliareLocations = () =>
  useQuery<IImobiliareFlatLocation[]>({
    queryKey: imobiliareKeys.locations,
    queryFn: ImobiliareApi.getLocations,
    staleTime: 1000 * 60 * 60,
  });
