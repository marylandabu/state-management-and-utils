import axios, { AxiosInstance, AxiosResponse } from "axios";
import { getConfig } from "./config";

export const authAxios: AxiosInstance = axios.create();

export const getToken = () => localStorage.getItem("token");
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const signIn = async (reqBody: { email: string; password: string }) => {
  const {
    baseURL,
    endpoints,
    authorization,
    debug,
    actions: { setAccessToken, setUserData },
  } = getConfig();
  const body = { user: reqBody };

  try {
    const response: AxiosResponse = await axios.post(
      `${baseURL}${endpoints.login}`,
      body
    );

    const accessToken = response.headers[authorization];
    if (debug) {
      console.log("debugging sign in", {
        response,
        accessToken,
        headers: response.headers,
      });
    }
    if (accessToken) localStorage.setItem("token", accessToken);
    setAccessToken(accessToken);
    setUserData(response?.data?.data);

    return accessToken;
  } catch (err) {
    console.error(err);
  }
};

export const signUp = async (reqBody: { email: string; password: string }) => {
  const {
    baseURL,
    endpoints,
    authorization,
    debug,
    actions: { setAccessToken, setUserData },
  } = getConfig();
  const body = { user: reqBody };

  try {
    const response: AxiosResponse = await axios.post(
      `${baseURL}${endpoints.signup}`,
      body
    );

    const accessToken = response.headers[authorization];
    if (debug) {
      console.log("debugging sign up", {
        response,
        accessToken,
        headers: response.headers,
      });
    }
    if (accessToken) localStorage.setItem("token", accessToken);
    setAccessToken(accessToken);
    setUserData(response?.data?.data);

    return accessToken;
  } catch (err) {
    console.error(err);
  }
};

export const fetchUser = async () => {
  const { baseURL, endpoints, debug } = getConfig();
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const response = await authAxios.get(`${baseURL}${endpoints.currentUser}`);
    if (debug) {
      console.log("debugging sign in", {
        response,
        token,
        headers: response.headers,
      });
    }
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const logOut = async () => {
  const {
    baseURL,
    endpoints,
    actions: { clearUser },
  } = getConfig();

  try {
    const response = await authAxios.delete(`${baseURL}${endpoints.logout}`);
    if (response.status === 200) {
      localStorage.removeItem("token");
      clearUser();
    }
    return response.data;
  } catch (error) {
    console.log("unable to logout", error);
  }
};
