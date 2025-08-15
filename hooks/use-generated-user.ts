import { useGeneratedUserStore } from "@/store/generated-user";

const useGeneratedUser = () => {
    const user = useGeneratedUserStore((state) => state.user);
    const setUser = useGeneratedUserStore((state) => state.setUser);
    const removeUser = useGeneratedUserStore((state) => state.removeUser);

    return { user, setUser, removeUser };
};

export { useGeneratedUser };