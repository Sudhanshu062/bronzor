import { useTokenStore } from "@/store/token";

const useToken = () => {
    const token = useTokenStore((state) => state.token);
    const setToken = useTokenStore((state) => state.setToken);
    const removeToken = useTokenStore((state) => state.removeToken);

    return { token, setToken, removeToken };
};

export { useToken }