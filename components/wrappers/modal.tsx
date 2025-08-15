"use client";

import React, { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

import { useMediaQuery } from "@/hooks/use-media-query";

type Props = {
    title: string;
    description: string;
    content: (onClose: () => void) => React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
};

const Modal = ({
    title,
    description,
    content,
    open,
    onOpenChange,
    children,
}: Props) => {

    const [internalOpen, setInternalOpen] = useState(false);

    const isDesktop = useMediaQuery("(min-width: 768px)");

    const isControlled = open !== undefined && onOpenChange !== undefined;
    const actualOpen = isControlled ? open : internalOpen;
    const setOpenState = isControlled ? onOpenChange! : setInternalOpen;

    const handleClose = () => setOpenState(false);

    if (isDesktop) {
        return (
            <Dialog open={actualOpen} onOpenChange={setOpenState}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    {content(handleClose)}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={actualOpen} onOpenChange={setOpenState}>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>{description}</DrawerDescription>
                </DrawerHeader>
                <div className="px-4">{content(handleClose)}</div>
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );

};

export { Modal };
