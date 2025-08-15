import { ArchiveX, File, Inbox, Send, Trash2 } from "lucide-react"

const nav = [
    {
        title: "Inbox",
        url: "#",
        icon: Inbox,
        isActive: true,
    },
    {
        title: "Drafts",
        url: "#",
        icon: File,
        isActive: false,
    },
    {
        title: "Sent",
        url: "#",
        icon: Send,
        isActive: false,
    },
    {
        title: "Junk",
        url: "#",
        icon: ArchiveX,
        isActive: false,
    },
    {
        title: "Trash",
        url: "#",
        icon: Trash2,
        isActive: false,
    }
]

export { nav }