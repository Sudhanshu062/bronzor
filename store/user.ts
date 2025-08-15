import { create } from 'zustand';

interface IUser {
    avatar: string
    email: string;
    username: string;
}

interface IUserStore {
    user: IUser;
    setUser: (v: IUserStore['user']) => void;
    removeUser: () => void;
}

const initialState: IUser = {
    avatar: "https://ui.shadcn.com/avatars/shadcn.jpg",
    email: "",
    username: ""
};

const useUserStore = create<IUserStore>((set) => ({
    user: initialState,
    setUser: (v) => set({ user: v }),
    removeUser: () => set({ user: initialState })
}));

export { useUserStore };
