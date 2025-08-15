"use client"

import React from 'react'
import { useTheme } from "next-themes"

import { Moon, Sun } from "lucide-react"

import { Button } from '@/components/ui/button'

const ModeToggleButton = () => {
    const { theme, setTheme } = useTheme()
    return (
        <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            variant="secondary"
            size="icon"
            className="size-8"
        >
            {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
    )
}

export { ModeToggleButton as ModeToggle }