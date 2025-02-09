"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export type Entity = {
    id: string;
    name: string;
    description: string;
    type: string;
    geoLocation?: {
        latitude: number;
        longitude: number;
    };
    icon?: string;
    featuredImage?: string;
}

export default function SlideShow({
    selectedId,
    onCardClick,
    cls,
    data
}: {
    selectedId: string | null;
    onCardClick: (id: string) => void;
    cls: string;
    data: Entity[];
}) {
    useEffect(() => {
        if (selectedId) {
            const card = document.querySelector(`[data-id="${selectedId}"]`);
            if (card) {
                card.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    }, [selectedId]);

    return (
        <div className={cn("flex space-x-4 px-4 w-full overflow-x-auto overflow-y-hidden relative items-end", cls)}>
            {data.filter(d => d.geoLocation).map((entity) => (
                <Card
                    key={entity.id}
                    className={cn(
                        "w-[200px] pointer-events-auto transition-all flex-none cursor-pointer",
                        selectedId === entity.id ? "mb-3 " : " rounded-b-none overflow-hidden"
                    )}
                    style={{
                        height: selectedId === entity.id ? "300px" : "100px",
                    }}
                    data-id={entity.id}
                    onClick={() => onCardClick(entity.id)}
                >
                    <CardHeader>
                        <Image
                            // src={entity.featuredImage || "/poi_placeholder.svg"}
                            src={"/poi_placeholder.svg"}
                            alt={entity.name || ""}
                            width={200}
                            height={100}
                            className="h-[100px] w-full object-cover rounded-t-lg"
                        />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center truncate line-clamp-1 whitespace-normal">
                            <Image
                                src={"/poi_placeholder.svg"}
                                // src={entity.icon || "/poi_placeholder.svg"}
                                alt={`${entity.name} icon`}
                                width={24}
                                height={24}
                                className="w-6 h-6 mr-2"
                            />
                            <CardTitle>{entity.name}</CardTitle>
                        </div>
                        <CardDescription className="mt-2 truncate whitespace-normal line-clamp-2">
                            {entity.description}
                        </CardDescription>
                    </CardContent>
                    <CardFooter>
                        <Badge>{entity.type}</Badge>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}

