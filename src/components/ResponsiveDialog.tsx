import * as React from "react"

// import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
// import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

export default function DrawerDialog({
    children,
    open,
    title,
    ...props
}: {
    children: React.ReactNode;
    open?: boolean;
    title?: string;
}) {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} {...props}>
                {/* <DialogTrigger asChild>
                    <Button variant="outline">Edit Profile</Button>
                </DialogTrigger> */}
                <DialogContent className="sm:max-w-[425px]">
                    <DialogTitle>{title}</DialogTitle>
                    {/* <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader> */}
                    {children}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} {...props}>
            <DrawerTitle>{title}</DrawerTitle>
            {/* <DrawerTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DrawerTrigger> */}
            <DrawerContent>
                {/* <DrawerHeader className="text-left">
                    <DrawerTitle>Edit profile</DrawerTitle>
                    <DrawerDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DrawerDescription>
                </DrawerHeader> */}
                {children}
                <DrawerFooter className="pt-2">
                    {/* <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose> */}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
