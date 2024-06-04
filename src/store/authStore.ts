import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import { devtools } from "zustand/middleware";
import { AuthState, UserData } from "./types";

const authStore = createStore<AuthState>()(
  devtools(
    (set) => ({
      accessToken: undefined,
      userData: undefined,
      actions: {
        setAccessToken: (accessToken: string) => set({ accessToken }),
        setUserData: (userData: UserData) => set({ userData }),
        clearUser: () => set({ accessToken: undefined, userData: undefined }),
      },
    }),
    { name: "auth-store", enabled: true }
  )
);

const accessTokenSelector = (state: AuthState) => state.accessToken;
const userDataSelector = (state: AuthState) => state.userData;
const actionsSelector = (state: AuthState) => state.actions;

export const getActions = () => actionsSelector(authStore.getState());
export const getAccessToken = () => accessTokenSelector(authStore.getState());
export const getUserData = () => userDataSelector(authStore.getState());

function useAuthStore<T>(
  selector: (state: AuthState) => T,
  equalityFn?: (a: T, b: T) => boolean
) {
  return useStore(authStore, selector, equalityFn);
}

export const useAccessToken = () => useAuthStore(accessTokenSelector);
export const useUserData = () => useAuthStore(userDataSelector);
export const useActions = () => useAuthStore(actionsSelector);
