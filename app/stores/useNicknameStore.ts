import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface NicknameStore {
  nickname?: string;
  setNickname: (str: string) => void;
}

const useNicknameStore = create<NicknameStore>()(
  persist(
    (set, get) => ({
      nickname: undefined,
      setNickname: (str) => set(() => ({ nickname: str })),
    }),
    {
      name: "nickname",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useNicknameStore;
