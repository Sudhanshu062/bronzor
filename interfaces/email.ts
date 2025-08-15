interface IEmailBase {
    "@id": string;
    "@type": string;
    id: string;
    msgid: string;
    from: IPerson;
    to: IPerson[];
    subject: string;
    intro: string;
    seen: boolean;
    isDeleted: boolean;
    hasAttachments: boolean;
    size: number;
    downloadUrl: string;
    sourceUrl: string;
    createdAt: string;
    updatedAt: string;
    accountId: string;
}

interface IEmail extends IEmailBase {
    cc: IPerson[];
    bcc: IPerson[];
    flagged: boolean;
    verifications: string[];
    retention: boolean;
    retentionDate: string;
    text: string;
    html: string[];
    attachments: IAttachment[];
}
