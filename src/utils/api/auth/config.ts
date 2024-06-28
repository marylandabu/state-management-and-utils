import { getActions } from "../../../store/authStore";

export interface Config {
  authorization: string;
  baseURL: string;
  debug: boolean;
  endpoints: {
    login: string;
    currentUser: string;
    logout: string;
    signup: string;
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
    signup: "/auth/signup",
  },
  debug: false,
  authorization: "authorization",
  actions, // Include actions in the defaultConfig
};

let config: Config = { ...defaultConfig };

export const setConfig = (newConfig: Partial<Config>) => {
  config = { ...config, ...newConfig };
};
//
export const getConfig = () => config;
