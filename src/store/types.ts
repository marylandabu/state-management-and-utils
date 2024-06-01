export interface UserData {
  id: number;
  email: string;
  created_at: string;
}
export interface AuthState {
  accessToken: string | undefined;
  userData: UserData | undefined;
  actions: {
    setAccessToken: (accessToken: string) => void;
    setUserData: (userData: UserData) => void;
    clearUser: () => void;
  };
}
