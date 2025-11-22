import { ERole } from "@/common/enums/role/role.enums";
import { IUpdateMeUserPayload } from "@/common/interfaces/payloads/update-me-user-payload.interface";
import { IUpdateUserByIdPayload } from "@/common/interfaces/payloads/update-user-by-id-payload.interface";
import { IUser } from "@/common/interfaces/user/user.interface";
import { http } from "@/services/http";

export const UsersApi = {
  getMe: async (): Promise<IUser> => {
    const { data } = await http.get<IUser>("/users/me");
    return data;
  },

  getAll: async (): Promise<IUser[]> => {
    const { data } = await http.get<IUser[]>("/users");
    return data;
  },

  getById: async (userId: string): Promise<IUser> => {
    const { data } = await http.get<IUser>(`/users/${userId}`);
    return data;
  },

  updateUserById: async (userId: string, payload: IUpdateUserByIdPayload): Promise<IUser> => {
    const { data } = await http.patch<IUser>(`/users/${userId}`, payload);
    return data;
  },

  updateMe: async (payload: IUpdateMeUserPayload): Promise<IUser> => {
    const { data } = await http.patch<IUser>("/users/me", payload);
    return data;
  },

  uploadProfilePicture: async (file: File): Promise<IUser> => {
    const formData = new FormData();
    formData.append("avatar", file);
    const { data } = await http.post<IUser>("/users/me/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  uploadProfilePictureForUser: async (userId: string, file: File): Promise<IUser> => {
    const formData = new FormData();
    formData.append("avatar", file);
    const { data } = await http.post<IUser>(`/users/${userId}/profile-picture`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  updateRole: async (userId: string, role: ERole): Promise<IUser> => {
    const { data } = await http.patch<IUser>(`/users/${userId}/role`, { role });
    return data;
  },
};
