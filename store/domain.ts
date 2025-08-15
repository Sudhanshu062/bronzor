import { create } from 'zustand';

interface IDomainStore {
    domains: IDomain[];
    setDomains: (domains: IDomain[]) => void;
    resetDomains: () => void;
}

const useDomainStore = create<IDomainStore>((set) => ({
    domains: [],
    setDomains: (domains) => set({ domains }),
    resetDomains: () => set({ domains: [] }),
}));

export { useDomainStore };
