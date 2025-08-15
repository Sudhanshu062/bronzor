"use client"

import React, { useEffect, useState, useCallback } from "react"

import { RefreshCcw, X, CheckCircle2 } from "lucide-react"
import throttle from "lodash.throttle"
import { AnimatePresence, motion } from "motion/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

const ConnectionStatusBanner = () => {

    const [isOffline, setIsOffline] = useState(!navigator.onLine)
    const [showSuccess, setShowSuccess] = useState(false)

    const updateStatus = useCallback(

        throttle(() => {

            const currentlyOffline = !navigator.onLine

            if (isOffline && !currentlyOffline) {
                setShowSuccess(true)
                setTimeout(() => setShowSuccess(false), 3000)
            }

            setIsOffline(currentlyOffline)

        }, 1000),

        [isOffline]

    )

    useEffect(() => {

        window.addEventListener("online", updateStatus)
        window.addEventListener("offline", updateStatus)

        return () => {
            window.removeEventListener("online", updateStatus)
            window.removeEventListener("offline", updateStatus)
        }

    }, [updateStatus])

    const handleRetest = () => {

        if (navigator.onLine) {

            setIsOffline(false)
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)

        } else { toast.error("You're still offline. Please check your connection.") }

    }

    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    key="offline-banner"
                    initial={{ y: "-100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full fixed top-0 left-0 z-50 bg-red-600 text-white p-4 px-6 flex justify-between items-center shadow-md"
                    role="alert"
                    aria-live="assertive"
                >
                    <h1 className="font-extrabold text-lg">
                        You are currently offline. Some features may not work.
                    </h1>
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" onClick={handleRetest}>
                            <RefreshCcw className="h-4 w-4" />
                            Retest Connection
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOffline(false)}
                            className="size-8"
                            aria-label="Close offline banner"
                        >
                            <X />
                        </Button>
                    </div>
                </motion.div>
            )}

            {showSuccess && (
                <motion.div
                    key="online-success"
                    initial={{ y: "-100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full fixed top-0 left-0 z-50 bg-green-600 text-white p-4 px-6 flex justify-between items-center shadow-md"
                    role="status"
                    aria-live="polite"
                >
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                        <p className="font-semibold">You're back online</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export { ConnectionStatusBanner }
