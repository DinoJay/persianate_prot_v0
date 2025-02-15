"use client";
import { useState, useCallback } from "react";
import MapBox from "@/components/MapBox";
import SlideShow, { Entity } from "@/components/SlideShow";
import { POIDrawer } from "@/components/POIDrawer";
import mockData from "@/mock-data.json";

const startId = mockData.entities[0].id;

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(startId)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
    if (selectedId === id) {
      setIsDrawerOpen(true)
    }
  }, [selectedId])

  return (
    <div className="flex-1 flex flex-col relative">
      <POIDrawer
        isOpen={isDrawerOpen}
        selectedId={selectedId}
      />
      <div className="mt-auto w-full z-10 pointer-events-none ">
        <SlideShow
          selectedId={selectedId}
          onCardClick={handleSelect}
          cls=""
          data={mockData.entities
            .filter((e): e is typeof e & { name: string; description: string; type: string } =>
              Boolean(e.name && e.description && e.type && e.geoLocation)
            )
            .map((e): Entity => ({
              id: e.id,
              name: e.name,
              description: e.description,
              type: e.type,
              geoLocation: e.geoLocation || undefined,
              icon: e.icon || undefined,
              featuredImage: e.featuredImage || undefined
            }))}
        />
      </div>
      <div className="absolute left-0 top-0 h-full w-full">
        <MapBox
          onMarkerClick={handleSelect}
          selectedId={selectedId}
        />
      </div>
    </div>
  );
}
