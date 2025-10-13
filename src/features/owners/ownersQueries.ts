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
