import axios from "axios";
import { toast } from "sonner";

import { useTokenStore } from "@/store/token";

import { whisper } from "@/utils/whisper";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL as string;

axios.defaults.baseURL = baseURL;

type Props = {
    url: string;
    configurations?: IConfigurations;
    authorization?: boolean;
};

const GET = async <R = undefined>({
    url,
    configurations = { headers: {}, params: {} },
    authorization = false
}: Props): Promise<IResponse<R>> => {

    const { token } = useTokenStore.getState();

    try {

        const {
            config,
            data,
            headers,
            request,
            status,
            statusText
        } = await axios.get(url, {

            headers: {
                'Content-Type': 'application/json',
                ...(authorization && token ? { 'Authorization': `Bearer ${token}` } : {}),
                ...configurations.headers,
            },

            params: configurations.params,

        });

        return {
            config,
            data: data !== undefined ? data : undefined,
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

export { GET };
