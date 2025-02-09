"use client"
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import mockData from "@/mock-data.json";
import * as d3 from 'd3';
import SlideShow from '@/components/SlideShow'

type Node = {
    id: string;
    name: string;
    group: string;
    x?: number;
    y?: number;
}

type Link = {
    source: Node;
    target: Node;
    value: number;
}

export default function TypePage() {
    const [viewBox, setViewBox] = useState("0 0 100 100");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const slideShowRef = useRef<HTMLDivElement>(null);
    // const nodesRef = useRef(mockData.entities.map(entity => ({
    //     id: entity.id,
    //     name: entity.name,
    //     group: entity.type
    // })));

    // Memoize static data structures
    const { nodes, links } = useMemo(() => {
        const graphNodes = mockData.entities.map(entity => ({
            id: entity.id,
            name: entity.name,
            group: entity.type
        }));

        const graphLinks = mockData.entities.reduce((acc, entity) => {
            if (entity.links) {
                const validLinks = entity.links.filter(targetId =>
                    mockData.entities.some(e => e.id === targetId)
                );
                const newLinks = validLinks.map(targetId => ({
                    source: graphNodes.find(n => n.id === entity.id)!,
                    target: graphNodes.find(n => n.id === targetId)!,
                    value: 1
                }));
                return [...acc, ...newLinks];
            }
            return acc;
        }, [] as Link[]);

        return { nodes: graphNodes, links: graphLinks };
    }, []);

    // Calculate viewBox based on nodes and selection
    const calculateViewBox = useCallback(() => {
        const currentNodes = simulationRef.current?.nodes() || [];
        if (!selectedId) {
            const padding = 40;
            const baseCardHeight = 100;
            const bottomPadding = baseCardHeight + padding;

            const xs = currentNodes.map(n => n.x!);
            const ys = currentNodes.map(n => n.y!);
            const minX = Math.min(...xs) - padding;
            const maxX = Math.max(...xs) + padding;
            const minY = Math.min(...ys) - padding;
            const maxY = Math.max(...ys) + padding;
            const width = maxX - minX;
            const height = maxY - minY + bottomPadding;

            return `${minX} ${minY} ${width} ${height}`;
        }

        // Calculate selection viewBox
        const connectedIds = new Set([selectedId]);
        links.forEach(link => {
            if (link.source.id === selectedId) connectedIds.add(link.target.id);
            if (link.target.id === selectedId) connectedIds.add(link.source.id);
        });

        const relevantNodes = currentNodes.filter(node => connectedIds.has(node.id));
        const padding = 40;
        const baseCardHeight = 100;
        const bottomPadding = baseCardHeight + padding;

        const xs = relevantNodes.map(n => n.x!);
        const ys = relevantNodes.map(n => n.y!);
        const minX = Math.min(...xs) - padding;
        const maxX = Math.max(...xs) + padding;
        const minY = Math.min(...ys) - padding;
        const maxY = Math.max(...ys) + padding;
        const width = maxX - minX;
        const height = maxY - minY + bottomPadding;

        return `${minX} ${minY} ${width} ${height}`;
    }, [selectedId, links]);

    useEffect(() => {
        simulationRef.current = d3.forceSimulation<Node>(nodes)
            .force("link", d3.forceLink<Node, Link>(links)
                .id(d => d.id)
                .distance(80))
            .force("charge", d3.forceManyBody()
                .strength(-300)
                .distanceMin(50)
                .distanceMax(200))
            .force("x", d3.forceX()
                .strength(0.09)
                .x(0))
            .force("y", d3.forceY()
                .strength(0.05)
                .y((_, i) => (i - nodes.length / 2) * 0.8))
            // .force("collision", d3.forceCollide()
            //     .radius(25)
            //     .strength(1))
            .alphaDecay(0.01)
            .on("tick", () => {
                setViewBox(calculateViewBox());
            });

        return () => simulationRef.current?.stop();
    }, [nodes, links, calculateViewBox]);

    // Get current node positions for rendering
    const currentNodes = simulationRef.current?.nodes() || nodes;

    // Update viewBox when selection changes
    useEffect(() => {
        console.log('viewbox', calculateViewBox())
        setViewBox(calculateViewBox());
    }, [selectedId, calculateViewBox]);

    const handleSelect = useCallback((id: string) => {
        console.log('id', id)
        setSelectedId(id);

    }, []);

    return (
        <div className="flex-1 flex flex-col relative">
            <div id="outer-cont" ref={containerRef} className="flex-1 flex flex-col relative">
                <svg
                    width="100%"
                    height="100%"
                    viewBox={viewBox}
                    style={{ transition: 'all 0.5s ease-in-out' }}
                >
                    <g>
                        {links.map((link) => {
                            const source = currentNodes.find(n => n.id === link.source.id);
                            const target = currentNodes.find(n => n.id === link.target.id);
                            if (!source?.x || !target?.x) return null;
                            return (
                                <line
                                    key={`${link.source.id}-${link.target.id}`}
                                    x1={source.x}
                                    y1={source.y}
                                    x2={target.x}
                                    y2={target.y}
                                    stroke="#999"
                                    strokeWidth={2}
                                    strokeOpacity={0.6}
                                />
                            );
                        })}
                        {currentNodes.map((node) => (
                            <circle
                                key={node.id}
                                cx={node.x}
                                cy={node.y}
                                r={15}
                                fill={node.group === 'POI' ? 'blue' : 'red'}
                                stroke="white"
                                strokeWidth={1.5}
                                onClick={() => handleSelect(node.id)}
                                style={{
                                    transition: 'fill 0.2s ease-in-out',
                                }}
                            />
                        ))}
                    </g>
                </svg>
            </div>
            <div ref={slideShowRef} className="fixed bottom-0 left-0 w-full overflow-auto">
                <SlideShow
                    selectedId={selectedId}
                    onCardClick={handleSelect}
                    cls="flex-1"
                    data={mockData.entities}
                />
            </div>
        </div>
    );
} 