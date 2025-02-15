"use client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navbar() {
    const pathname = usePathname()

    // Get unique types from mock data
    // const types = Array.from(new Set(mockData.entities.map(entity => entity.type.toLowerCase())))

    const types = ['/', 'connections']

    return (
        <div className="border-b">
            <nav className="mx-auto flex h-16 max-w-screen-2xl items-center gap-4 px-4">
                {/* <Link
                    href="/"
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === "/" ? "text-black" : "text-muted-foreground"
                    )}
                >
                    All */}
                {/* </Link> */}

                {types.map((type) => (
                    <Link
                        key={type}
                        href={`/${type}`}
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            pathname === `/${type}` ? "text-black" : "text-muted-foreground"
                        )}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Link>
                ))}
            </nav>
        </div >
    )
} 