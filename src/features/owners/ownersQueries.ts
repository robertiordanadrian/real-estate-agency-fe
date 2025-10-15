import { useMutation, useQuery } from "@tanstack/react-query";
import { OwnersApi } from "./ownersApi";
import { IOwner } from "../../common/interfaces/owner.interface";

export const ownersKeys = {
  byAgent: (agentId: string) => ["owners", "byAgent", agentId] as const,
  byId: (id: string) => ["owners", "byId", id] as const,
};

export const useOwnersByAgentQuery = (agentId: string) =>
  useQuery({
    queryKey: ownersKeys.byAgent(agentId),
    queryFn: () => OwnersApi.getAllByAgent(agentId),
    enabled: !!agentId,
  });

export const useOwnerByIdQuery = (id: string) =>
  useQuery({
    queryKey: ownersKeys.byId(id),
    queryFn: () => OwnersApi.getById(id),
    enabled: !!id,
  });

export const useCreateOwner = () =>
  useMutation({
    mutationFn: (payload: Omit<IOwner, "_id" | "createdAt" | "updatedAt">) =>
      OwnersApi.create(payload),
  });

export const useOwnersBatchQuery = (ownerIds: string[]) =>
  useQuery({
    queryKey: ["owners", "batch", ownerIds],
    queryFn: async () => {
      const unique = [...new Set(ownerIds.filter(Boolean))];
      const results = await Promise.all(
        unique.map((id) => OwnersApi.getById(id))
      );
      const map: Record<string, IOwner> = {};
      results.forEach((o) => (map[o._id] = o));
      return map;
    },
    enabled: ownerIds.length > 0,
  });
