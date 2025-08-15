"use client"

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import axios from 'axios'
import { format } from 'date-fns'
import { saveAs } from 'file-saver';
import {
    SendIcon,
    Star,
    Paperclip,
    Reply,
    EllipsisVertical,
    Printer,
    Eye,
    ArrowDownToLine
} from 'lucide-react'
import { toast } from 'sonner';

import { EmailViewer } from '@/app/(root)/email/[slug]/_components/email-viewer'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { useToken } from '@/hooks/use-token'

import { GET } from '@/utilities/requests/get'

const Page = () => {

    const pathname = usePathname()
    const id = pathname.split('/').pop() || '';

    const [email, setEmail] = useState<IEmail>();

    const [status, setStatus] = useState<{ isLoading: boolean }>({ isLoading: false });
    const [error, setError] = useState<string | null>(null);

    const { token } = useToken()

    useEffect(() => {

        if (!token && !id) return;
        if (status.isLoading || email) return;

        setStatus({ isLoading: true });

        if (error) setError(null);

        const fetchEmail = async () => {

            try {

                const { data } = await GET<IEmail>({
                    url: `${process.env.NEXT_PUBLIC_MAIL_TM_BASE_URL}/messages/${id}`,
                    configurations: { headers: { 'Authorization': `Bearer ${token}` } }
                })

                setEmail(data);

            } catch (error: any) {

                console.error("Error fetching domains:", error);
                setError("Failed to fetch domains. Please try again.");

            } finally { setStatus({ isLoading: false }) }

        };

        fetchEmail();

    }, []);

    const handleDownload = async (file: IAttachment) => {

        try {

            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_MAIL_TM_BASE_URL}${file.downloadUrl}`, {
                headers: { 'Authorization': `Bearer ${token}` },
                responseType: 'blob',
            });

            saveAs(data, file.filename);

        } catch (error) { console.error("Failed to download file:", error) }

    };

    const handleView = async (file: IAttachment) => {

        try {

            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_MAIL_TM_BASE_URL}${file.downloadUrl}`, {
                headers: { 'Authorization': `Bearer ${token}` },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(data);
            window.open(url, '_blank');

        } catch (error) {
            console.error('Error viewing file:', error);
            toast.error('Failed to open the file. Please try again later.');
        }

    };

    if (!token || status.isLoading) return (
        <div className="h-full flex flex-col bg-background text-foreground animate-pulse">

            <div className="px-4 py-2 border-b">
                <Skeleton className="h-6 w-1/2" />
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>

                <Skeleton className="h-4 w-24" />
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-3 bg-muted/50">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full max-w-[90%]" />
                ))}
            </div>

            <div className="border-t px-4 py-3">
                <div className="flex gap-2 overflow-x-auto">
                    {[...Array(2)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-40 rounded-md" />
                    ))}
                </div>
            </div>

            <div className="border-t px-4 py-3">
                <Skeleton className="h-10 w-full rounded-md" />
            </div>

        </div>
    );

    if (!email) return <div>not found</div>;

    return (
        <main className="h-full flex flex-col justify-between bg-background text-foreground">

            {email?.subject && (
                <div className='px-4 py-2 border-b text-xl font-extrabold'>
                    Subject : {email?.subject}
                </div>
            )}

            <header className="flex justify-between items-center px-4 py-3 border-b">

                <div className="flex items-center gap-2">

                    <Avatar className="w-10 h-10">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                        <span className="font-semibold text-sm">{email?.from.name}</span>
                        <span className="text-xs text-muted-foreground">to me</span>
                    </div>

                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">

                    <span>{format(new Date(email?.createdAt), 'EEE dd MMM, HH:mm')}</span> |

                    <div className="flex justify-center items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="p-1"
                        >
                            <Star className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="p-1"
                        >
                            <Reply className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="p-1"
                        >
                            <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="p-1"
                        >
                            <EllipsisVertical className="h-4 w-4" />
                        </Button>
                    </div>

                </div>

            </header>

            <section className="flex-1 overflow-auto space-y-4 text-sm leading-relaxed">
                {email?.html && email.html.map((htmlContent) => (
                    <EmailViewer
                        key="1"
                        html={htmlContent}
                    />
                ))}
            </section>

            <section>
                {email?.attachments && email.attachments.length > 0 && (
                    <div className="border-t p-4 flex flex-col gap-2">
                        <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
                            {email.attachments.map((file, index) => (
                                <div
                                    key={index}
                                    className="relative flex items-center gap-2 cursor-pointer min-w-[200px] px-3 py-2 border rounded-md bg-muted text-sm whitespace-nowrap shrink-0 group"
                                >
                                    <Paperclip className="w-4 h-4 text-muted-foreground" />

                                    <span>{file.filename}</span>

                                    <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
                                        <Button
                                            onClick={() => handleView(file)}
                                            size="icon"
                                            className="size-8 cursor-pointer"
                                        >
                                            <Eye />
                                        </Button>
                                        <Button
                                            onClick={() => handleDownload(file)}
                                            size="icon"
                                            className="size-8 cursor-pointer"
                                        >
                                            <ArrowDownToLine />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            <footer className="flex flex-col gap-2 border-t px-4 py-3">
                <div className="relative">
                    <Input
                        id="reply-input"
                        className="pe-10"
                        placeholder="Write a reply..."
                        type="text"
                    />
                    <button
                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-all outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50"
                        aria-label="Send"
                    >
                        <SendIcon size={16} />
                    </button>
                </div>
            </footer>

        </main>
    )

}

export default Page
