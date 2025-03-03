"use client";
import mockData from "@/mock-data.json";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
// import { useEffect } from "react";

export default function AllDataPage() {
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    // Get unique types from mock data
    const types = Array.from(new Set(mockData.entities.map(entity => entity.type)));

    // Filter entities based on selected types
    const filteredEntities = selectedTypes.length > 0
        ? mockData.entities.filter(entity => selectedTypes.includes(entity.type))
        : mockData.entities;

    const toggleType = (type: string) => {
        setSelectedTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold mb-4">All Data</h1>
            <div className="mb-4 flex flex-wrap gap-2">
                {types.map((type) => (
                    <Badge
                        key={type}
                        variant={selectedTypes.includes(type) ? "secondary" : "default"}
                        onClick={() => toggleType(type)}
                        className="cursor-pointer"
                    >
                        {type}
                    </Badge>
                ))}
            </div>
            <div className="flex overflow-x-auto space-x-4 w-full">
                {filteredEntities.map((entity) => (
                    <Card key={entity.id} className="flex-none w-80 " style={{ height: "480px" }}>
                        <CardContent className="flex flex-col h-full">
                            <Image
                                src={entity.featuredImage || "/poi_placeholder.svg"}
                                alt={entity.name || ""}
                                width={300}
                                height={150}
                                className="h-[150px] w-full object-cover rounded-t-lg"
                            />
                            <CardTitle className="text-lg font-semibold">{entity.name}</CardTitle>
                            <p className="text-sm text-gray-600">{entity.description}</p>
                            <div className="mt-2">
                                <Badge>{entity.type}</Badge>
                            </div>
                            {entity.geoLocation && (
                                <div className="mt-2 text-xs text-gray-500">
                                    <p>Location: {entity.geoLocation.latitude}, {entity.geoLocation.longitude}</p>
                                </div>
                            )}
                            {entity.links && entity.links.length > 0 && (
                                <div className="mt-2">
                                    <h3 className="font-semibold">Related Links:</h3>
                                    <div className="flex gap-1 flex-wrap">
                                        {entity.links.map(linkId => (
                                            <Badge key={linkId} variant="secondary">
                                                {linkId}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 