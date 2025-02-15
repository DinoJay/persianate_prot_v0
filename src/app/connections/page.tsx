"use client"
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import mockData from "@/mock-data.json";
import * as d3 from 'd3';
import SlideShow, { Entity } from '@/components/SlideShow';

type Node = {
    id: string;
    name: string | undefined;  // Allow undefined since some nodes might not have names
    group: string;
    x: number;
    y: number;
} & d3.SimulationNodeDatum;

type Link = d3.SimulationLinkDatum<Node> & {
    source: Node;  // Override to ensure source is always Node
    target: Node;  // Override to ensure target is always Node
    value: number;
}

export default function TypePage() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [neighbors, setNeighbors] = useState<Set<string>>(new Set());
    const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentNodes, setCurrentNodes] = useState<Node[]>([]);
    const [containerSize, setContainerSize] = useState({ width: 1000, height: 1000 });
    // const nodesRef = useRef(mockData.entities.map(entity => ({
    //     id: entity.id,
    //     name: entity.name,
    //     group: entity.type
    // })));

    // Memoize static data structures
    const { nodes, links } = useMemo(() => {
        const validEntities = mockData.entities
        const graphNodes = validEntities.map(entity => ({
            id: entity.id,
            name: entity.name,
            group: entity.type,
            x: 0,  // Initialize with default coordinates
            y: 0
        } as Node));

        const graphLinks = validEntities.reduce<Link[]>((acc, entity) => {
            if (entity.links) {
                const validLinks = entity.links.filter(targetId =>
                    graphNodes.some(n => n.id === targetId)
                );
                const newLinks = validLinks.map(targetId => ({
                    source: graphNodes.find(n => n.id === entity.id)!,
                    target: graphNodes.find(n => n.id === targetId)!,
                    value: 1
                } as Link));
                return [...acc, ...newLinks];
            }
            return acc;
        }, []);

        return { nodes: graphNodes, links: graphLinks };
    }, []);

    // Update container size on mount and resize
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    useEffect(() => {
        // Initialize nodes with valid coordinates
        nodes.forEach((node) => {
            node.x = containerSize.width / 2;
            node.y = containerSize.height / 2;
        });
        setCurrentNodes(nodes);

        // Calculate dimensions based on container size
        const baseDistance = Math.min(containerSize.width, containerSize.height) * 0.1; // 10% of smallest dimension
        const baseCharge = -Math.min(containerSize.width, containerSize.height) * 0.3; // 30% of smallest dimension
        const baseRadius = Math.min(containerSize.width, containerSize.height) * 0.015; // 1.5% of smallest dimension

        simulationRef.current = d3.forceSimulation<Node>(nodes)
            .force("link", d3.forceLink<Node, Link>(links)
                .id(d => d.id)
                .distance(baseDistance)     // Scale link distance with container
                .strength(0.5))            // Reduced strength for more flexibility
            .force("charge", d3.forceManyBody()
                .strength(baseCharge)      // Scale charge with container
                .distanceMin(baseDistance * 0.5)
                .distanceMax(baseDistance * 5))
            .force("x", d3.forceX()
                .strength(0.1)
                .x(containerSize.width / 2))
            .force("y", d3.forceY()
                .strength(0.1)
                .y(containerSize.height / 2))
            .force("collision", d3.forceCollide()
                .radius(baseRadius)        // Scale collision radius with container
                .strength(0.8))
            .alphaDecay(0.01)
            .alphaMin(0.6)
            .on("tick", () => {
                if (simulationRef.current) {
                    const nodes = simulationRef.current.nodes();
                    setCurrentNodes([...nodes]);
                }
            });

        return () => void simulationRef.current?.stop();
    }, [nodes, links, containerSize]);

    const findConnectedNodes = (startId: string, links: Link[]): Set<string> => {
        const connected = new Set<string>();
        const queue = [startId];

        while (queue.length > 0) {
            const currentId = queue.shift()!;
            connected.add(currentId);

            // Find all nodes connected to current node
            links.forEach(link => {
                const source = (link.source as Node).id;
                const target = (link.target as Node).id;

                // Check both directions
                if (source === currentId && !connected.has(target)) {
                    queue.push(target);
                }
                if (target === currentId && !connected.has(source)) {
                    queue.push(source);
                }
            });
        }

        return connected;
    };

    // Update the selection effect
    useEffect(() => {
        if (selectedId) {
            setNeighbors(findConnectedNodes(selectedId, links));
        } else {
            setNeighbors(new Set());
        }
    }, [selectedId, links]);

    // Get current node positions for rendering

    // Add separate effect for viewBox updates
    // useEffect(() => {
    // }, [selectedId, calculateViewBox]);

    const handleSelect = useCallback((id: string) => {
        console.log('id', id)
        setSelectedId(id);

    }, []);

    const calculateTransform = useCallback(() => {
        if (!currentNodes.length) {
            return { scale: 1, translateX: 0, translateY: 0 };
        }

        const padding = selectedId ? 30 : 10;
        const slideShowHeight = selectedId ? 250 : 100;
        const bottomPadding = padding + slideShowHeight;

        // Get nodes to focus on (selected node and its neighbors)
        let nodesToShow = currentNodes;
        if (selectedId) {
            nodesToShow = currentNodes.filter(node => neighbors.has(node.id));
        }

        // Calculate bounds for visible nodes
        const xs = nodesToShow.map(n => n.x || 0);
        const ys = nodesToShow.map(n => n.y || 0);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        // Calculate dimensions with padding
        const width = Math.max(maxX - minX + padding * 4, 100); // Minimum width to prevent extreme zoom
        const height = Math.max(maxY - minY + padding * 4 + bottomPadding, 100); // Minimum height

        // Calculate scale to fit
        let scale = Math.min(
            containerSize.width / width,
            (containerSize.height - slideShowHeight) / height
        );

        // Apply extra zoom for selected nodes
        if (selectedId) {
            scale *= 1.5;
        }

        // Calculate translation to center the visible nodes
        const translateX = (containerSize.width - (maxX + minX) * scale) / 2;
        const translateY = (containerSize.height - slideShowHeight - (maxY + minY) * scale) / 2;

        return { scale, translateX, translateY };
    }, [currentNodes, containerSize, selectedId, neighbors]);

    const transform = calculateTransform();

    return (
        <div className="flex-1 flex flex-col relative">
            <div ref={containerRef} className="flex-1 flex flex-col relative">
                <svg width="100%" className="flex-1" viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}>
                    <g style={{
                        transition: 'transform 0.5s ease-out',
                        transform: `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`
                    }}>
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
                                    strokeWidth={2 / transform.scale}
                                    strokeOpacity={selectedId && !neighbors.has(link.source.id) && !neighbors.has(link.target.id) ? 0.2 : 0.6}
                                    style={{
                                        transition: 'stroke-opacity 0.5s ease-out'
                                    }}
                                />
                            );
                        })}
                        {currentNodes.map((node) => {
                            if (typeof node.x !== 'number' || typeof node.y !== 'number') return null;

                            const isSelected = selectedId === node.id;
                            const isNeighbor = selectedId && neighbors.has(node.id);
                            const opacity = selectedId ? (isSelected || isNeighbor ? 1 : 0.3) : 1;

                            return (
                                <circle
                                    key={node.id}
                                    cx={node.x}
                                    cy={node.y}
                                    r={(isSelected ? 20 : 15) / transform.scale}
                                    fill={node.group === 'POI' ? 'blue' : 'red'}
                                    stroke="white"
                                    strokeWidth={(isSelected ? 2.5 : 1.5) / transform.scale}
                                    opacity={opacity}
                                    onClick={() => handleSelect(node.id)}
                                    style={{
                                        transition: 'r 0.5s ease-out, stroke-width 0.5s ease-out, opacity 0.5s ease-out',
                                        cursor: 'pointer'
                                    }}
                                />
                            );
                        })}
                    </g>
                </svg>
                <div className="absolute bottom-0 left-0 w-full overflow-auto pointer-events-none">
                    <SlideShow
                        selectedId={selectedId}
                        onCardClick={handleSelect}
                        cls="flex-1"
                        data={mockData.entities as Entity[]}
                    />
                </div>
            </div>
        </div>
    );
} 