"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"

import { formatDistanceToNow } from "date-fns"
import { Command } from "lucide-react"

import { NavUser } from "@/app/(root)/_components/user"

import { ModeToggle } from "@/components/layout/buttons/mode-toggle"

import { Label } from "@/components/ui/label"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInput,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"

import { nav } from "@/data/nav"

import { useToken } from "@/hooks/use-token"

import { GET } from "@/utilities/requests/get"

const AppSidebar = ({
    ...props
}: React.ComponentProps<typeof Sidebar>) => {

    const [activeItem, setActiveItem] = useState(nav[0])

    const [emails, setEmails] = useState<IEmailBase[]>([])

    const [unreadOnly, setUnreadOnly] = useState(false)

    const [status, setStatus] = React.useState<{ isLoading: boolean }>({ isLoading: false });
    const [error, setError] = React.useState<string | null>(null);

    const { token } = useToken()

    const { setOpen } = useSidebar()

    useEffect(() => {

        if (!token || status.isLoading || emails.length > 0) return;
        setStatus({ isLoading: true });

        if (error) setError(null);

        const fetchEmails = async () => {

            try {

                const { data } = await GET<IPagedCollection<IEmailBase>>({
                    url: `${process.env.NEXT_PUBLIC_MAIL_TM_BASE_URL}/messages`,
                    configurations: { headers: { Authorization: `Bearer ${token}` } }
                })

                setEmails(data["hydra:member"]);

            } catch (error: any) {

                console.error("Error fetching domains:", error);
                setError("Failed to fetch domains. Please try again.");

            } finally { setStatus({ isLoading: false }) }

        };

        fetchEmails();

    }, [token]);

    const visibleEmails = unreadOnly
        ? emails.filter((email) => !email.seen)
        : emails

    return (
        <Sidebar
            collapsible="icon"
            className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
            {...props}
        >
            <Sidebar
                collapsible="none"
                className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
            >
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                                <a href="#">
                                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                        <Command className="size-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">Acme Inc</span>
                                        <span className="truncate text-xs">Enterprise</span>
                                    </div>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent className="px-1.5 md:px-0">
                            <SidebarMenu>
                                {nav.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            tooltip={{
                                                children: item.title,
                                                hidden: false,
                                            }}
                                            onClick={() => {
                                                setActiveItem(item)
                                                const email = emails.sort(() => Math.random() - 0.5)
                                                setEmails(
                                                    email.slice(
                                                        0,
                                                        Math.max(5, Math.floor(Math.random() * 10) + 1)
                                                    )
                                                )
                                                setOpen(true)
                                            }}
                                            isActive={activeItem?.title === item.title}
                                            className="px-2.5 md:px-2"
                                        >
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <ModeToggle />
                    <NavUser />
                </SidebarFooter>
            </Sidebar>

            <Sidebar collapsible="none" className="hidden flex-1 md:flex">
                <SidebarHeader className="gap-3.5 border-b p-4">
                    <div className="flex w-full items-center justify-between">
                        <div className="text-foreground text-base font-medium">
                            {activeItem?.title}
                        </div>
                        <Label className="flex items-center gap-2 text-sm">
                            <span>Unreads</span>
                            <Switch
                                className="shadow-none"
                                checked={unreadOnly}
                                onCheckedChange={setUnreadOnly}
                            />
                        </Label>
                    </div>
                    <SidebarInput placeholder="Type to search..." />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup className="px-0">
                        <SidebarGroupContent>
                            {status.isLoading && (
                                <div className="p-4 space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="space-y-4">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-full" />
                                            <Skeleton className="h-3 w-5/6" />
                                        </div>
                                    ))}
                                </div>
                            )}
                            {error && (<div className="p-4 text-sm text-red-500">error</div>)}
                            {!status.isLoading && visibleEmails.length === 0 && (
                                <div className="p-2 px-4 text-sm text-muted-foreground">
                                    {unreadOnly ? "No unread emails." : "No emails found."}
                                </div>
                            )}
                            {!status.isLoading && visibleEmails.map((mail) => (
                                <Link
                                    href={`/email/${mail.id}`}
                                    key={mail.msgid}
                                    className={`hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0 ${mail.seen ? "" : "bg-muted"}`}
                                >
                                    <div className="flex w-full items-center gap-2">
                                        <span>{mail.from.name}</span>{" "}
                                        <span className="ml-auto text-xs">{formatDistanceToNow(new Date(mail.createdAt), { addSuffix: true })}</span>
                                    </div>
                                    {mail?.subject && <span className="font-medium">{mail.subject}</span>}
                                    <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
                                        {mail.intro}
                                    </span>
                                </Link>
                            ))}
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </Sidebar>
    )
}

export { AppSidebar }