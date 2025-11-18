import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAppDispatch } from "@/app/hook";
import { ERole } from "@/common/enums/role/role.enums";
import { http } from "@/services/http";
import { logout, setCredentials } from "@/features/auth/authSlice";

type LoginPayload = { email: string; password: string };
type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: {
    _id: string;
    email: string;
    name: string;
    role: ERole;
    profilePicture?: string;
    phone: string;
  };
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
};
type RegisterResponse = LoginResponse;

export const useLogin = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await http.post<LoginResponse>("/auth/login", payload);
      return data;
    },
    onSuccess: (data) => {
      dispatch(
        setCredentials({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          user: {
            _id: data.user._id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role as ERole,
            profilePicture: data.user.profilePicture,
            phone: data.user.phone,
          },
        }),
      );
    },
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await http.post("/auth/logout");
      return true;
    },
    onSuccess: async () => {
      dispatch(logout());
      localStorage.removeItem("app.auth");

      await qc.invalidateQueries();
      qc.removeQueries();
    },
    onError: async (err) => {
      console.error("Eroare la logout:", err);
      dispatch(logout());
      localStorage.removeItem("app.auth");
      await qc.invalidateQueries();
      qc.removeQueries();
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await http.post<RegisterResponse>("/auth/register", payload);
      return data;
    },
  });
};
