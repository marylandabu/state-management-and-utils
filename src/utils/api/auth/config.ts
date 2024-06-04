export interface Config {
  baseURL: string;
  endpoints: {
    login: string;
    currentUser: string;
    logout: string;
  };
}

const defaultConfig: Config = {
  baseURL: "http://localhost:3000/api",
  endpoints: {
    login: "/auth/login",
    currentUser: "/auth/current_user",
    logout: "/auth/logout",
  },
};

let config: Config = { ...defaultConfig };

export const setConfig = (newConfig: Partial<Config>) => {
  config = { ...config, ...newConfig };
};

export const getConfig = () => config;