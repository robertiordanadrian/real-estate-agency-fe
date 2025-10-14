import { useMutation } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { selectAuth } from "../auth/authSelectors";
import { setCredentials } from "../auth/authSlice";
import { UsersApi } from "./usersApi";

export const useUploadProfilePicture = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

  return useMutation({
    mutationFn: UsersApi.uploadProfilePicture,
    onSuccess: (data) => {
      if (auth.user && auth.accessToken && auth.refreshToken) {
        dispatch(
          setCredentials({
            user: { ...auth.user, profilePicture: data.profilePicture },
            accessToken: auth.accessToken,
            refreshToken: auth.refreshToken,
          })
        );
      }
    },
  });
};
