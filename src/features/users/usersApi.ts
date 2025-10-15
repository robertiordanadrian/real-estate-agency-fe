import { http } from "../../services/http";

export const UsersApi = {
  getMe: async () => {
    const { data } = await http.get("/users/me");
    return data;
  },

  updateMe: async (payload: {
    name?: string;
    email?: string;
    role?: string;
    password?: string;
    confirmPassword?: string;
  }) => {
    const { data } = await http.patch("/users/me", payload);
    return data;
  },

  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const { data } = await http.post("/users/me/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  uploadProfilePictureForUser: async (userId: string, file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const { data } = await http.post(
      `/users/${userId}/profile-picture`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data;
  },

  updateRole: async (userId: string, role: "CEO" | "MANAGER" | "AGENT") => {
    const { data } = await http.patch(`/users/${userId}/role`, { role });
    return data;
  },
};
