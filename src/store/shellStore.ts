import { create } from 'zustand';
interface ShellState {
user?: { id: string; name: string };
setUser: (user: ShellState['user']) => void;
}
export const useShellStore = create<ShellState>((set) => ({
user: undefined,
setUser: (user) => set({ user })
}));