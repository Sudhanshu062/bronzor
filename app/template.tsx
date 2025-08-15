"use client"

import React from 'react'

import { LoginForm } from "@/components/forms/login"
import { ConnectionStatusBanner } from '@/components/layout/banners/connection-status'
import { Card, CardContent } from "@/components/ui/card"

import { useToken } from '@/hooks/use-token'

const Template = ({
    children
}: {
    children: React.ReactNode
}) => {

    const { token } = useToken()

    if (!token) {
        return (
            <>
                <ConnectionStatusBanner />
                <main className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-sm md:max-w-3xl space-y-4">
                        <Card className="overflow-hidden p-0">
                            <CardContent className="grid p-0 md:grid-cols-2">
                                <LoginForm />
                                <div className="bg-muted relative hidden md:block">
                                    <img
                                        src="http://ui.shadcn.com/placeholder.svg"
                                        alt="Image"
                                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <p className="text-muted-foreground text-center text-xs text-balance">
                            By clicking continue, you agree to our{" "}
                            <a href="#" className="underline underline-offset-4 hover:text-primary">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="underline underline-offset-4 hover:text-primary">
                                Privacy Policy
                            </a>.
                        </p>
                    </div>
                </main>
            </>

        )
    }

    return (
        <>
            <ConnectionStatusBanner />
            {children}
        </>
    )

}

export default Template
