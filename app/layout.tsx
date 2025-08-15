import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
import { ModeProvider } from "@/components/providers/mode";

import "./globals.css";

export const metadata: Metadata = {
    title: "Bronzor - Disposable Mail Service",
    description: "Bronzor provides fast, secure, and anonymous disposable email addresses. Protect your privacy and avoid spam with temporary inboxes.",
};

import React from 'react'

const RootLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <html lang="en">
            <body>
                <ModeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ModeProvider>
                <Toaster />
            </body>
        </html>
    );
}

export default RootLayout
