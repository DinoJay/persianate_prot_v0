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
    <div className="flex relative justify-center flex-col items-center h-screen w-screen">
      <POIDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedId={selectedId}
      />
      <div className="absolute top-0 left-0 w-full z-10">
        <div className="mt-3">
          <SlideShow selectedId={selectedId} onCardClick={handleSelect} />
        </div>
      </div>
      <div className="w-full flex-1">
        <MapBox
          onMarkerClick={id => handleSelect(id, selectedId)}
          selectedId={selectedId}
        />
      </div>
    </div>
  );
}
