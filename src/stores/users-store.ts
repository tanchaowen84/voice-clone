import { create } from 'zustand';

interface UsersState {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  refreshTrigger: 0,
  triggerRefresh: () =>
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));
