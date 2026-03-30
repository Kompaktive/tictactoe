import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NicknameStore {
  nickname: string;
  setNickname: (str: string) => void;
}

const useNicknameStore = create<NicknameStore>()(
  persist(
    (set) => ({
      nickname: "",
      setNickname: (str) => set(() => ({ nickname: str })),
    }),
    { name: "nickname-storage" },
  ),
);

export default useNicknameStore;
