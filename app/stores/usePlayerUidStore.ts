/*
  use to uniquely identify player, in case they left the game
  and wants to rejoin the game
*/
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PlayerUidStore {
  uid?: string;
  setUid: (str: string) => void;
}

const usePlayerUidStore = create<PlayerUidStore>()(
  persist(
    (set) => ({
      uid: undefined,
      setUid: (str) => set(() => ({ uid: str })),
    }),
    {
      name: "uid-player-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default usePlayerUidStore;
