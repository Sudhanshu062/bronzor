"use client"

import React, { useEffect, useState } from "react"
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

import { useToken } from "@/hooks/use-token"
import { useUser } from "@/hooks/use-user"

import { GET } from "@/utilities/requests/get"

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

const NavUser = () => {

  const [status, setStatus] = useState<{ isLoading: boolean }>({ isLoading: false })
  const [error, setError] = useState<string | null>(null)

  const { token } = useToken()
  const { user, setUser } = useUser()

  const { isMobile } = useSidebar()

  useEffect(() => {

    if (status.isLoading || (user.email && user.username)) return
    setStatus({ isLoading: true })

    if (error) setError(null)

    const fetchUser = async () => {

      try {

        const { data } = await GET<IResponse>({
          url: `${process.env.NEXT_PUBLIC_MAIL_TM_BASE_URL}/me`,
          configurations: { headers: { Authorization: `Bearer ${token}` } },
        })

        setUser({
          avatar: "https://ui.shadcn.com/avatars/shadcn.jpg",
          email: data?.address,
          username: data?.address.split("@")[0],
        })

      } catch (error: any) {

        console.error("Error fetching user:", error)
        setError("Failed to fetch user.")

      } finally { setStatus({ isLoading: false }) }

    }

    fetchUser()

  }, [status.isLoading, error])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {status.isLoading ? (
          <SidebarMenuButton size="lg" className="md:h-8 md:p-0">
            <div className="flex items-center gap-2 w-full">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="flex flex-col gap-1 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </SidebarMenuButton>
        ) : error ? (
          <SidebarMenuButton size="lg" className="text-red-500">
            <div className="text-sm truncate">Error loading user</div>
          </SidebarMenuButton>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className="rounded-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.username}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback className="rounded-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.username}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export { NavUser }
