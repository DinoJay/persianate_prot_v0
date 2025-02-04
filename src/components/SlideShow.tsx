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

const entities: Entity[] = [
    {
        id: "poi-1",
        name: "Persepolis",
        description: "Ancient ceremonial capital of the Achaemenid Empire.",
        type: "POI",
        icon: "https://example.com/persepolis-icon.png",
        featuredImage: "https://example.com/persepolis.jpg",
    },
    {
        id: "poi-2",
        name: "Naqsh-e Jahan Square",
        description: "A UNESCO World Heritage Site in Isfahan.",
        type: "POI",
        icon: "https://example.com/naqsh-e-jahan-icon.png",
        featuredImage: "https://example.com/naqsh-e-jahan.jpg",
    },
    {
        id: "person-1",
        name: "Asghar Farhadi",
        description: "Acclaimed Iranian film director.",
        type: "Person",
        icon: "https://example.com/asghar-farhadi-icon.png",
        featuredImage: "https://example.com/asghar-farhadi.jpg",
    },
    {
        id: "film-1",
        name: "A Separation",
        description: "An award-winning Iranian drama directed by Asghar Farhadi.",
        type: "Film",
        icon: "https://example.com/a-separation-icon.png",
        featuredImage: "https://example.com/a-separation.jpg",
    },
    {
        id: "book-1",
        name: "The Windward",
        description: "A novel by Sadegh Hedayat exploring existential themes.",
        type: "Book",
        icon: "https://example.com/windward-icon.png",
        featuredImage: "https://example.com/windward.jpg",
    },
]

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

