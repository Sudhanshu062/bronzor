import { useUserStore } from "@/store/user";

const useUser = () => {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const removeUser = useUserStore((state) => state.removeUser);

    return { user, setUser, removeUser };
};

export { useUser }