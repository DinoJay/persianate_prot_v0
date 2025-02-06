"use client";
import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import mockData from '@/mock-data.json'

import 'mapbox-gl/dist/mapbox-gl.css';


function MapBox({ onMarkerClick, selectedId }: { onMarkerClick: (id: string) => void, selectedId: string | null }) {

    const mapRef = useRef<mapboxgl.Map | null>(null)
    const mapContainerRef = useRef<HTMLDivElement | null>(null)

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

            mockData.entities
                .filter((item): item is typeof item & { geoLocation: { longitude: number, latitude: number } } =>
                    item.geoLocation !== undefined &&
                    typeof item.geoLocation.longitude === 'number' &&
                    typeof item.geoLocation.latitude === 'number'
                )
                .forEach((item) => {
                    if (!mapRef.current) return;

                    const popup = new mapboxgl.Popup({ offset: 25 })
                    // .setHTML(`<h3>${item.name}</h3>`);

                    new mapboxgl.Marker({ color: 'red' })
                        .setLngLat([item.geoLocation.longitude, item.geoLocation.latitude])
                        .setPopup(popup)  // Attach popup to marker
                        .addTo(mapRef.current);

                    popup.on('open', () => {
                        console.log(item.id);
                        onMarkerClick(item.id);
                    });
                });
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove()
            }
        }
    }, [])  // Add back onMarkerClick dependency

    useEffect(() => {
        console.log('selectedId', selectedId)
    }, [selectedId])

    useEffect(() => {
        if (selectedId && mapRef.current) {
            const selectedLocation = mockData.entities
                .find(item => item.id === selectedId)
                ?.geoLocation;
            if (selectedLocation?.longitude && selectedLocation?.latitude) {
                const offset: [number, number] = [0, window.innerHeight / 5];
                mapRef.current.flyTo({
                    center: [selectedLocation.longitude, selectedLocation.latitude],
                    offset,
                    zoom: 12,
                    duration: 2000
                });
            }
        }
    }, [selectedId]);

    return (
        <>
            <div id='map-container' ref={mapContainerRef} className="w-full h-full" />
        </>
    )
}

export default MapBox