import { create } from 'zustand';

interface IGeneratedUser {
    address: string;
    password: string;
}

interface IGeneratedUserStore {
    user: IGeneratedUser;
    setUser: (v: IGeneratedUserStore['user']) => void;
    removeUser: () => void;
}

const initialState: IGeneratedUser = {
    address: "",
    password: ""
};

const useGeneratedUserStore = create<IGeneratedUserStore>((set) => ({
    user: initialState,
    setUser: (v) => set({ user: v }),
    removeUser: () => set({ user: initialState })
}));

export { useGeneratedUserStore };
