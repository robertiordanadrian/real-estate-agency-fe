import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../../services/http";
import { logout, setCredentials } from "./authSlice";
import { useAppDispatch } from "../../app/hook";

type LoginPayload = { email: string; password: string };
type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    profilePicture?: string;
  };
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: string;
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
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role as
              | "CEO"
              | "MANAGER"
              | "TEAM_LEAD"
              | "AGENT"
              | undefined,
            profilePicture: data.user.profilePicture,
          },
        })
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
      // 🧹 curăță userul din Redux
      dispatch(logout());
      localStorage.removeItem("app.auth");

      // 🔥 curăță cache-ul React Query (inclusiv ["me"])
      await qc.invalidateQueries();
      qc.removeQueries(); // elimină complet datele stale
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
      const { data } = await http.post<RegisterResponse>(
        "/auth/register",
        payload
      );
      return data;
    },
  });
};
