import { getActions } from "../../../store/authStore";

export interface Config {
  authorization: string;
  baseURL: string;
  endpoints: {
    login: string;
    currentUser: string;
    logout: string;
  };
  actions: ReturnType<typeof getActions>; // Define the type for actions
}

const actions = getActions();

const defaultConfig: Config = {
  baseURL: "http://localhost:3000/api",
  endpoints: {
    login: "/auth/login",
    currentUser: "/auth/current_user",
    logout: "/auth/logout",
  },
  authorization: "authorization",
  actions, // Include actions in the defaultConfig
};

let config: Config = { ...defaultConfig };

export const setConfig = (newConfig: Partial<Config>) => {
  config = { ...config, ...newConfig, actions };
};

export const getConfig = () => config;
