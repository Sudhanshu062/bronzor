import { GET } from "@/utilities/requests/get";

export const getEmails = async (): Promise<{ emails: IEmailBase[] } | null> => {

    try {

        const { data } = await GET<IPagedCollection<IEmailBase>>({
            url: `${process.env.NEXT_PUBLIC_MAIL_TM_BASE_URL}/messages`,
            authorization: true
        });

        return { emails: data["hydra:member"] };

    } catch (error) {

        console.error('Server fetch failed:', error);
        return null;

    }

};

