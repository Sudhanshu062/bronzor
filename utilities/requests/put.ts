import axios from "axios";
import { toast } from "sonner";

import { useTokenStore } from "@/store/token";

import { whisper } from "@/utils/whisper";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL as string;

axios.defaults.baseURL = baseURL;

type Props<T = any> = {
    url: string;
    data: T;
    configurations?: IConfigurations;
    notifications?: INotifications;
    authorization?: boolean;
};

const PUT = async <T = any, R = undefined>({
    url,
    data,
    configurations = { headers: {}, params: {} },
    notifications = {
        loading: "Loading ...",
        success: "Success!",
        error: "Sorry, something went wrong while processing your request.",
    },
    authorization = false
}: Props<T>): Promise<IResponse<R>> => {

    const { token } = useTokenStore.getState();

    try {

        const response = toast.promise(

            axios.put(url, data, {

                headers: {
                    'Content-Type': 'application/json',
                    ...(authorization && token ? { 'Authorization': `Bearer ${token}` } : {}),
                    ...configurations.headers,
                },

                params: configurations.params,

            }),

            {
                loading: notifications.loading,
                success: (response) => response?.data?.message || notifications.success,
                error: (error) => error?.response?.data?.message || notifications.error,
            }

        );

        const {
            config,
            data: unwrap,
            headers,
            request,
            status,
            statusText
        } = await response?.unwrap();

        return {
            config,
            data: unwrap !== undefined ? unwrap : undefined,
            headers,
            request,
            status,
            statusText
        };

    } catch (e) {

        whisper("Request Error: ", e);

        const message = axios.isAxiosError(e)
            ? e?.response?.data?.message || "Sorry, something went wrong while processing your request."
            : e instanceof Error
                ? e.message
                : "An unexpected error occurred.";

        toast.error(message);

        throw e;

    }

};

export { PUT };
