import * as React from "react"

// import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
// import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerTitle,
} from "@/components/ui/drawer"

export default function DrawerDialog({
    children,
    open,
    title,
    onOpenChange,
    ...props
}: {
    children: React.ReactNode;
    open?: boolean;
    title?: string;
    onOpenChange?: (open: boolean) => void;
}) {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange} {...props}>
                {/* <DialogTrigger asChild>
                    <Button variant="outline">Edit Profile</Button>
                </DialogTrigger> */}
                <DialogContent className="sm:max-w-[425px] sm:max-h-[700px] flex flex-col">
                    <DialogTitle>{title}</DialogTitle>
                    {/* <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader> */}
                    <div className="overflow-auto">{children}</div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} {...props}>
            {/* <DrawerTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DrawerTrigger> */}
            <DrawerContent className="flex flex-col max-h-[700px]">
                <DrawerTitle className="hidden">{title}</DrawerTitle>
                {/* <DrawerHeader className="text-left">
                    <DrawerTitle>Edit profile</DrawerTitle>
                    <DrawerDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DrawerDescription>
                </DrawerHeader> */}

                <div className="overflow-auto flex-1">{children}</div>
                <DrawerFooter className="pt-2">
                    {/* <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose> */}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
