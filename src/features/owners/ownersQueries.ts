import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ICreateOwnerPayload } from "@/common/interfaces/payloads/create-owner-payload.interface";
import { OwnersApi } from "@/features/owners/ownersApi";

export const ownersKeys = {
  all: ["owners", "all"] as const,
  byId: (id: string) => ["owners", "byId", id] as const,
};

export const useOwnersQuery = () =>
  useQuery({
    queryKey: ownersKeys.all,
    queryFn: OwnersApi.getAll,
  });

export const useOwnerByIdQuery = (id: string) =>
  useQuery({
    queryKey: ownersKeys.byId(id),
    queryFn: () => OwnersApi.getById(id),
    enabled: !!id,
  });

export const useCreateOwner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateOwnerPayload) => OwnersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ownersKeys.all });
    },
    onError: (err: any) => {
      console.error("❌ Error creating owner:", err);
    },
  });
};

export const useDeleteOwner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => OwnersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ownersKeys.all });
    },
    onError: (err: any) => {
      console.error("❌ Error deleting owner:", err);
    },
  });
};
