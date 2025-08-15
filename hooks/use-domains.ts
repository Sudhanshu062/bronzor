import { useDomainStore } from "@/store/domain";

const useDomains = () => {
    const domains = useDomainStore((state) => state.domains);
    const setDomains = useDomainStore((state) => state.setDomains);
    const resetDomains = useDomainStore((state) => state.resetDomains);

    return { domains, setDomains, resetDomains };
};

export { useDomains }