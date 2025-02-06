"use client"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import mockData from "@/mock-data.json"
import Image from "next/image"
import ResponsiveDialog from '@/components/ResponsiveDialog'

export function POIDrawer({
    isOpen,
    onClose,
    selectedId
}: {
    isOpen: boolean
    onClose: () => void
    selectedId: string | null
}) {
    const selectedPOI = mockData.entities.find(item => item.id === selectedId)

    return (
        <ResponsiveDialog open={isOpen} onOpenChange={onClose} title={selectedPOI?.name}>
            {selectedPOI && (
                <div className="p-6 overflow-y-auto">
                    <Image
                        src={"/poi_placeholder.svg"}
                        alt={selectedPOI.name}
                        width={400}
                        height={200}
                        className="w-full h-[200px] object-cover rounded-lg mb-4"
                    />
                    <h2 className="text-2xl font-bold mb-2">{selectedPOI.name}</h2>
                    <p className="text-gray-600 mb-4">{selectedPOI.description}</p>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <span className="font-semibold mr-2">Type:</span>
                            <span>{selectedPOI.type}</span>
                        </div>
                        {selectedPOI.geoLocation && (
                            <div className="flex items-center">
                                <span className="font-semibold mr-2">Location:</span>
                                <span>
                                    {selectedPOI.geoLocation.latitude}, {selectedPOI.geoLocation.longitude}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

            )}
        </ResponsiveDialog>
    )
} 