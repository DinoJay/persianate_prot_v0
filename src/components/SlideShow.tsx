"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import mockData from "@/mock-data.json"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"



export default function PersianCulturePreview({ selectedId, onCardClick }: { selectedId: string | null, onCardClick: (id: string) => void }) {

    useEffect(() => {
        console.log('yeah', selectedId)
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
    }, [selectedId])

    return (
        <ScrollArea className="w-full whitespace-nowrap ">
            <div className="flex w-max space-x-4 p-4">
                {mockData.entities.filter(d => d.geoLocation).map((entity) => (
                    <Card
                        key={entity.id}
                        className={cn("w-[200px]", selectedId === entity.id ? "border-2 border-black" : "")}
                        data-id={entity.id}
                        onClick={() => onCardClick(entity.id)}
                    >
                        <CardHeader>
                            <Image
                                src={entity.featuredImage || "/placeholder.svg"}
                                alt={entity.name || ""}
                                width={200}
                                height={100}
                                className="h-[100px] w-full object-cover rounded-t-lg"
                            />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <Image
                                    src={entity.icon || "/placeholder.svg"}
                                    alt={`${entity.name} icon`}
                                    width={24}
                                    height={24}
                                    className="w-6 h-6"
                                />
                                <CardTitle>{entity.name}</CardTitle>
                            </div>
                            <CardDescription className="mt-2">{entity.description}</CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Badge>{entity.type}</Badge>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
}

