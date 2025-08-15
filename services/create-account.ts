import { POST } from "@/utilities/requests/post";

interface IRequest {
    address: string;
    password: string;
}

interface IResponse extends IHydraResource {
    id: string;
    address: string;
    quota: number;
    used: number;
    isDisabled: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export const createAccount = async (address: string, password: string) => {
    return await POST<IRequest, IResponse>({
        url: `${process.env.NEXT_PUBLIC_MAIL_TM_BASE_URL}/accounts`,
        data: { address, password },
    });
};