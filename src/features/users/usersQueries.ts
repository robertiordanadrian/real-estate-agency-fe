import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersApi } from "./usersApi";

export const usersKeys = {
  me: ["me"] as const,
};

export const useUserQuery = () =>
  useQuery({
    queryKey: usersKeys.me,
    queryFn: UsersApi.getMe,
    staleTime: 5 * 60 * 1000,
  });

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: UsersApi.updateMe,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.me });
    },
  });
};

export const useUploadProfilePicture = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: UsersApi.uploadProfilePicture,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.me });
    },
  });
};
