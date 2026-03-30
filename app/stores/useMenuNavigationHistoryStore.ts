import { create } from "zustand";

// add more later
export type MenuNavigation = "PLAY_WITH_FRIEND";

interface MenuNavigationHistoryStore {
  menuNavigationHistory: MenuNavigation[];
  pushMenuNavigationHistory: (str: MenuNavigation) => void;
  popMenuNavigationHistory: () => void;
}

const useMenuNavigationHistoryStore = create<MenuNavigationHistoryStore>(
  (set) => ({
    menuNavigationHistory: [],
    pushMenuNavigationHistory: (str) =>
      set((state) => ({
        menuNavigationHistory: [...state.menuNavigationHistory, str],
      })),
    popMenuNavigationHistory: () =>
      set((state) => ({
        menuNavigationHistory: state.menuNavigationHistory.slice(0, -1),
      })),
  }),
);

export default useMenuNavigationHistoryStore;
