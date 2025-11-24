import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IUpdateMeUserPayload } from "@/common/interfaces/payloads/update-me-user-payload.interface";
import { IUpdateUserByIdPayload } from "@/common/interfaces/payloads/update-user-by-id-payload.interface";
import { IUser } from "@/common/interfaces/user/user.interface";
import { UsersApi } from "@/features/users/usersApi";

export const usersKeys = {
  me: ["me"] as const,
  all: ["users"] as const,
  one: (id: string) => ["user", id] as const,
};

export const useUserQuery = () =>
  useQuery<IUser>({
    queryKey: usersKeys.me,
    queryFn: UsersApi.getMe,
    staleTime: Infinity,
  });

export const useAllUsersQuery = () =>
  useQuery({
    queryKey: usersKeys.all,
    queryFn: UsersApi.getAll,
    staleTime: Infinity,
  });

export const useUserByIdQuery = (userId: string) =>
  useQuery({
    queryKey: usersKeys.one(userId),
    queryFn: () => UsersApi.getById(userId),
    staleTime: Infinity,
    enabled: !!userId,
  });

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: IUpdateMeUserPayload) => UsersApi.updateMe(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.me });
      const me = qc.getQueryData<IUser>(usersKeys.me);
      if (me?._id) {
        qc.invalidateQueries({ queryKey: usersKeys.one(me._id) });
      }
      qc.invalidateQueries({ queryKey: usersKeys.all });
    },
    onError: (error) => {
      console.error("❌ Error updating user:", error);
    },
  });
};

export const useUpdateUserById = () => {
  const qc = useQueryClient();
  const { data: me } = useUserQuery();
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: IUpdateUserByIdPayload }) =>
      UsersApi.updateUserById(userId, payload),
    onSuccess: (_, { userId }) => {
      qc.invalidateQueries({ queryKey: usersKeys.all });
      qc.invalidateQueries({ queryKey: usersKeys.one(userId) });
      if (me?._id === userId) {
        qc.invalidateQueries({ queryKey: usersKeys.me });
      }
    },
    onError: (error) => {
      console.error("❌ Error updating user:", error);
    },
  });
};

export const useUploadProfilePicture = () => {
  const qc = useQueryClient();
  const { data: me } = useUserQuery();
  return useMutation({
    mutationFn: (file: File) => UsersApi.uploadProfilePicture(file),
    onSuccess: () => {
      const userId = me?._id;
      if (!userId) return;
      qc.invalidateQueries({ queryKey: usersKeys.me });
      qc.invalidateQueries({ queryKey: usersKeys.all });
      qc.invalidateQueries({ queryKey: usersKeys.one(userId) });
    },
    onError: (error) => {
      console.error("❌ Error uploading profile picture:", error);
    },
  });
};

export const useUploadProfilePictureForUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, file }: { userId: string; file: File }) =>
      UsersApi.uploadProfilePictureForUser(userId, file),
    onSuccess: (_data, variables) => {
      const userId = variables.userId;
      qc.invalidateQueries({ queryKey: usersKeys.one(userId) });
      qc.invalidateQueries({ queryKey: usersKeys.all });
    },
    onError: (error) => {
      console.error("❌ Error uploading profile picture for user:", error);
    },
  });
};
