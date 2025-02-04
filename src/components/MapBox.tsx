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

            mockData.entities.filter((item) => item.geoLocation).forEach((item) => {
                // Create popup
                const popup = new mapboxgl.Popup({ offset: 25 })
                // .setHTML(`<h3>${item.name}</h3>`);

                const marker = new mapboxgl.Marker({ color: 'red' })
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
            const selectedLocation = mockData.entities.find(item => item.id === selectedId)?.geoLocation;
            if (selectedLocation) {
                // Calculate offset to position point in last third
                const offset = [0, window.innerHeight / 5]; // Negative x value moves point left

                mapRef.current.flyTo({
                    center: [selectedLocation.longitude, selectedLocation.latitude],
                    offset: offset,
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