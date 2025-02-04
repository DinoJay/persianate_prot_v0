"use client";
import { useState } from "react";
import MapBox from "@/components/MapBox";
import SlideShow from "@/components/SlideShow";
import mockData from "@/mock-data.json";

const startId = mockData.entities[0].id;

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(startId)
  return (
    <div className="flex relative justify-center flex-col items-center h-screen w-screen ">
      <div className=" absolute top-0 left-0 w-full  z-10">
        <div className="mt-3">
          <SlideShow selectedId={selectedId} onCardClick={(id) => setSelectedId(id)} />

        </div>
      </div>
      <div className="w-full  flex-1">
        <MapBox
          onMarkerClick={(id) => setSelectedId(id)}
          selectedId={selectedId}
        />
      </div>
    </div>
  );
}
