"use client"
import mockData from "@/mock-data.json"
import Image from "next/image"
import ResponsiveDialog from '@/components/ResponsiveDialog'
import { Badge } from "./ui/badge"

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
                        alt={selectedPOI.name || ""}
                        width={400}
                        height={200}
                        className="w-full h-[300px] object-cover rounded-lg mb-6"
                    />

                    <div className="space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{selectedPOI.name}</h2>
                            <p className="text-gray-600">{selectedPOI.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <InfoItem label="Type" value={selectedPOI.type} />
                                {selectedPOI.poiType && (
                                    <InfoItem label="POI Type" value={selectedPOI.poiType.join(', ')} />
                                )}
                                {selectedPOI.whereToStay && (
                                    <InfoItem label="Where to Stay" value={selectedPOI.whereToStay} />
                                )}
                                {selectedPOI.howToGetThere && (
                                    <InfoItem label="How to Get There" value={selectedPOI.howToGetThere} />
                                )}
                            </div>
                            <div className="space-y-2">
                                {selectedPOI.handicraft && (
                                    <InfoItem label="Local Handicraft" value={selectedPOI.handicraft} />
                                )}
                                {selectedPOI.food && (
                                    <InfoItem label="Local Food" value={selectedPOI.food} />
                                )}
                                {selectedPOI.vibe && (
                                    <InfoItem label="Vibe" value={selectedPOI.vibe} />
                                )}
                                {selectedPOI.period && (
                                    <InfoItem label="Period" value={selectedPOI.period} />
                                )}
                            </div>
                        </div>

                        {selectedPOI.geoLocation && (
                            <div>
                                <h3 className="font-semibold mb-1">Location</h3>
                                <p>
                                    Latitude: {selectedPOI.geoLocation.latitude}
                                    <br />
                                    Longitude: {selectedPOI.geoLocation.longitude}
                                </p>
                            </div>
                        )}

                        {selectedPOI.links && selectedPOI.links.length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-1">Related Items</h3>
                                <div className="flex gap-2 flex-wrap">
                                    {selectedPOI.links.map(linkId => (
                                        <Badge key={linkId} variant="secondary">
                                            {linkId}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </ResponsiveDialog>
    )
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <span className="font-semibold">{label}:</span> {value}
        </div>
    )
} 