import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NicknameStore {
  nickname: string;
  hasHydrated: boolean;
  setNickname: (str: string) => void;
  setHasHydrated: (val: boolean) => void;
}

const useNicknameStore = create<NicknameStore>()(
  persist(
    (set) => ({
      nickname: "",
      hasHydrated: false,
      setNickname: (str) => set(() => ({ nickname: str })),
      setHasHydrated: (val) => set(() => ({ hasHydrated: val })),
    }),
    {
      name: "nickname-storage",
      partialize: (state) => ({ nickname: state.nickname }), // only save nickname to localStorage
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    },
  ),
);

export default useNicknameStore;
