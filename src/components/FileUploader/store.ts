import create from "zustand";

export interface FileData {
  url: string;
  type: string;
  original_filename: string;
  parent_folder_id: number | null;
  id: number;
}

export interface StoreState {
  files: FileData[];
  folders: FileData[];
  setFiles: (files: FileData[]) => void;
  setFolders: (folders: FileData[]) => void;
}

const useStore = create<StoreState>((set) => ({
  files: [],
  folders: [],
  setFiles: (files) => set({ files }),
  setFolders: (folders) => set({ folders }),
}));

export default useStore;
