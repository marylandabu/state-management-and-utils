import { useEffect } from "react";
import { getActions, useAccessToken, useUserData } from "../../store/authStore";
import { fetchUser, getToken } from "../api/auth/authApi";

const useGetUser = () => {
  const user = useUserData();
  const authToken = useAccessToken() || getToken();

  const { setUserData: setUser } = getActions();

  useEffect(() => {
    const setUserData = async () => {
      if (user) return;
      if (authToken) {
        try {
          const userData = await fetchUser();
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    setUserData();
  }, [authToken, user, setUser]);

  return user;
};

export default useGetUser;
