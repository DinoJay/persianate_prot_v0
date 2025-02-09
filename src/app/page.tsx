"use client";
import { useState, useCallback } from "react";
import MapBox from "@/components/MapBox";
import SlideShow from "@/components/SlideShow";
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
        onClose={() => setIsDrawerOpen(false)}
        selectedId={selectedId}
        data={mockData.entities}
      />
      <div className="mt-auto w-full z-10 pointer-events-none ">
        <SlideShow
          selectedId={selectedId}
          onCardClick={handleSelect}
          cls=""
          data={mockData.entities}
        />
      </div>
      <div className="absolute left-0 top-0 h-full w-full">
        <MapBox
          onMarkerClick={handleSelect}
          selectedId={selectedId}
          data={mockData.entities}
        />
      </div>
    </div>
  );
}
