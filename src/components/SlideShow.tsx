"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import mockData from "@/mock-data.json"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

interface Entity {
    id: string
    name: string
    description: string
    type: string
    icon: string
    featuredImage: string
}


export default function PersianCulturePreview({ selectedId, onCardClick }: { selectedId: string, onCardClick: (id: string) => void }) {

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
                            <img
                                src={entity.featuredImage || "/placeholder.svg"}
                                alt={entity.name}
                                className="h-[100px] w-full object-cover rounded-t-lg"
                            />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <img src={entity.icon || "/placeholder.svg"} alt={`${entity.name} icon`} className="w-6 h-6" />
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

