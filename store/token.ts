import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ITokenStore {
    token: string;
    setToken: (v: string) => void;
    removeToken: () => void;
}

const useTokenStore = create<ITokenStore>()(

    persist(

        (set) => ({
            token: '',
            setToken: (v) => set({ token: v }),
            removeToken: () => set({ token: '' }),
        }),

        { name: 'quark' }

    )

);

export { useTokenStore };
