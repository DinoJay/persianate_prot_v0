"use client";
import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import mockData from '@/mock-data.json'
import { Card, CardContent, CardTitle } from "@/components/ui/card";

import 'mapbox-gl/dist/mapbox-gl.css';

function MapBox({ onMarkerClick, selectedId }: { onMarkerClick: (id: string) => void, selectedId: string | null }) {
    const mapRef = useRef<mapboxgl.Map | null>(null)
    const mapContainerRef = useRef<HTMLDivElement | null>(null)
    const markersRef = useRef<mapboxgl.Marker[]>([])
    const [selectedPoint, setSelectedPoint] = useState<{ x: number, y: number } | null>(null);
    const [linkedEntities, setLinkedEntities] = useState<typeof mockData.entities>([]);
    const selectedEntityRef = useRef<typeof mockData.entities[0] | null>(null);

    // Update selected point when map moves
    const updateSelectedPoint = () => {
        if (selectedEntityRef.current?.geoLocation && mapRef.current) {
            const point = mapRef.current.project([
                selectedEntityRef.current.geoLocation.longitude,
                selectedEntityRef.current.geoLocation.latitude
            ]);
            setSelectedPoint({ x: point.x, y: point.y });
        }
    };

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
            console.error('Mapbox token is not defined');
            return;
        }

        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (mapContainerRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                center: [51.3890, 35.6892],
                zoom: 10.12
            });

            // Add move handlers
            mapRef.current.on('move', updateSelectedPoint);
            mapRef.current.on('zoom', updateSelectedPoint);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.off('move', updateSelectedPoint);
                mapRef.current.off('zoom', updateSelectedPoint);
                mapRef.current.remove()
            }
        }
    }, [])

    useEffect(() => {
        // Clean up existing markers
        // markersRef.current.forEach(marker => marker.remove());
        // markersRef.current = [];

        mockData.entities
            .filter((item): item is typeof item & { geoLocation: { longitude: number, latitude: number } } =>
                item.geoLocation !== undefined &&
                typeof item.geoLocation.longitude === 'number' &&
                typeof item.geoLocation.latitude === 'number'
            )
            .forEach((item) => {
                if (!mapRef.current) return;

                const popup = new mapboxgl.Popup({ offset: 25 })
                const marker = new mapboxgl.Marker({ color: 'red' })
                    .setLngLat([item.geoLocation.longitude, item.geoLocation.latitude])
                    .setPopup(popup)
                    .addTo(mapRef.current);

                popup.on('open', () => {
                    onMarkerClick(item.id);
                });

                markersRef.current.push(marker);
            });

        return () => {
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
        }
    }, [onMarkerClick])

    useEffect(() => {
        console.log('selectedId', selectedId)
    }, [selectedId])

    useEffect(() => {
        if (selectedId && mapRef.current) {
            const selectedLocation = mockData.entities
                .find(item => item.id === selectedId)
                ?.geoLocation;
            if (selectedLocation?.longitude && selectedLocation?.latitude) {
                const offset: [number, number] = [0, -window.innerHeight / 5];
                mapRef.current.flyTo({
                    center: [selectedLocation.longitude, selectedLocation.latitude],
                    offset,
                    zoom: 12,
                    duration: 2000
                });
            }
        }
    }, [selectedId]);

    useEffect(() => {
        if (selectedId) {
            const selectedEntity = mockData.entities.find(e => e.id === selectedId);
            selectedEntityRef.current = selectedEntity || null;

            if (selectedEntity?.links) {
                const linked = mockData.entities.filter(e => selectedEntity.links.includes(e.id));
                setLinkedEntities(linked);
            }

            // Update point position
            updateSelectedPoint();
        } else {
            selectedEntityRef.current = null;
            setLinkedEntities([]);
            setSelectedPoint(null);
        }
    }, [selectedId]);

    const radius = 150; // Radius of the circle
    const angleStep = (2 * Math.PI) / linkedEntities.length;

    return (
        <div className='w-full h-full relative overflow-hidden'>
            <div id='map-container' ref={mapContainerRef} className="w-full h-full" />
            {selectedPoint && linkedEntities.length > 0 && (
                <div className="absolute inset-0 pointer-events-none">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {linkedEntities.map((entity, index) => {
                            const angle = angleStep * index;
                            const x = radius * Math.cos(angle);
                            const y = radius * Math.sin(angle);

                            return (
                                <line
                                    key={`line-${entity.id}`}
                                    x1={selectedPoint.x}
                                    y1={selectedPoint.y}
                                    x2={selectedPoint.x + x}
                                    y2={selectedPoint.y + y}
                                    stroke="#999"
                                    strokeWidth="3"
                                    strokeOpacity="0.9"
                                />
                            );
                        })}
                    </svg>
                    {linkedEntities.map((entity, index) => {
                        const angle = angleStep * index;
                        const x = radius * Math.cos(angle);
                        const y = radius * Math.sin(angle);

                        return (
                            <Card
                                key={entity.id}
                                className="absolute pointer-events-auto w-30 cursor-pointer hover:scale-105 transition-transform"
                                style={{
                                    left: `${selectedPoint.x + x}px`,
                                    top: `${selectedPoint.y + y}px`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                                onClick={() => onMarkerClick(entity.id)}
                            >
                                <CardContent className="p-4">
                                    <CardTitle className="text-sm truncate">
                                        {entity.name}
                                    </CardTitle>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {entity.type}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default MapBox