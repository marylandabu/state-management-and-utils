import axios, { AxiosInstance, AxiosResponse } from "axios";
import { getConfig } from "./config";

// src/api.ts

export const authAxios: AxiosInstance = axios.create();

authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const signIn = async (reqBody: { email: string; password: string }) => {
  const { baseURL, endpoints } = getConfig();
  const body = { user: reqBody };

  try {
    const response: AxiosResponse = await axios.post(
      `${baseURL}${endpoints.login}`,
      body
    );

    const accessToken = response.headers["Authorization"];
    if (accessToken) localStorage.setItem("token", accessToken);

    return accessToken;
  } catch (err) {
    console.error(err);
  }
};

export const fetchUser = async () => {
  const { baseURL, endpoints } = getConfig();
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const response = await authAxios.get(`${baseURL}${endpoints.currentUser}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const logOut = async () => {
  const { baseURL, endpoints } = getConfig();

  try {
    const response = await authAxios.delete(`${baseURL}${endpoints.logout}`);
    if (response.status === 200) {
      localStorage.removeItem("token");
    }
    return response.data;
  } catch (error) {
    console.log("unable to logout", error);
  }
};
