import { useMutation, useQuery } from "@tanstack/react-query";
import { OwnersApi } from "./ownersApi";
import { IOwner } from "../../common/interfaces/owner.interface";

export const ownersKeys = {
  byAgent: (agentId: string) => ["owners", "byAgent", agentId] as const,
};

export const useOwnersByAgentQuery = (agentId: string) =>
  useQuery({
    queryKey: ownersKeys.byAgent(agentId),
    queryFn: () => OwnersApi.getByAgent(agentId),
    enabled: !!agentId,
  });

export const useCreateOwner = () =>
  useMutation({
    mutationFn: (payload: Omit<IOwner, "_id" | "createdAt" | "updatedAt">) =>
      OwnersApi.create(payload),
  });
