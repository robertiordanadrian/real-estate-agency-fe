import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { UsersApi } from "./usersApi";

export const usersKeys = {
  me: ["me"] as const,
  all: ["users"] as const,
  one: (id: string) => ["user", id] as const,
};

export const useUserQuery = () =>
  useQuery({
    queryKey: usersKeys.me,
    queryFn: UsersApi.getMe,
    staleTime: 5 * 60 * 1000,
  });

export const useAllUsersQuery = () =>
  useQuery({
    queryKey: usersKeys.all,
    queryFn: UsersApi.getAll,
    staleTime: 2 * 60 * 1000,
  });

export const useUserByIdQuery = (userId?: string) =>
  useQuery({
    queryKey: usersKeys.one(userId || ""),
    queryFn: () => UsersApi.getById(userId!),
    enabled: !!userId,
  });

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: UsersApi.updateMe,
    onSuccess: () => qc.invalidateQueries({ queryKey: usersKeys.me }),
  });
};

export const useUpdateUserById = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: {
        name?: string;
        email?: string;
        phone?: string;
        role?: string;
      };
    }) => UsersApi.updateUserById(userId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: usersKeys.all }),
  });
};

export const useUploadProfilePicture = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: UsersApi.uploadProfilePicture,
    onSuccess: () => qc.invalidateQueries({ queryKey: usersKeys.me }),
  });
};

export const useUploadProfilePictureForUser = () => {
  return useMutation({
    mutationFn: ({ userId, file }: { userId: string; file: File }) =>
      UsersApi.uploadProfilePictureForUser(userId, file),
  });
};
