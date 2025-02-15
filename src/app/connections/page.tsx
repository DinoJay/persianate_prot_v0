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
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentNodes, setCurrentNodes] = useState<array>([])
    const [containerSize, setContainerSize] = useState({ width: 1000, height: 1000 });
    // const nodesRef = useRef(mockData.entities.map(entity => ({
    //     id: entity.id,
    //     name: entity.name,
    //     group: entity.type
    // })));

    // Memoize static data structures
    const { nodes, links } = useMemo(() => {
        const validEntities = mockData.entities.filter(e => e.name && e.type);
        const graphNodes = validEntities.map(entity => ({
            id: entity.id,
            name: entity.name,
            group: entity.type
        }));

        const graphLinks = validEntities.reduce((acc: Link[], entity) => {
            if (entity.links) {
                const validLinks = entity.links.filter(targetId =>
                    graphNodes.some(n => n.id === targetId)
                );
                const newLinks = validLinks.map(targetId => ({
                    source: graphNodes.find(n => n.id === entity.id)!,
                    target: graphNodes.find(n => n.id === targetId)!,
                    value: 1
                }));
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
        // Initialize nodes in a circular layout for better starting positions
        nodes.forEach((node, i) => {
            node.x = containerSize.width / 2
            node.y = containerSize.height / 2
        });

        simulationRef.current = d3.forceSimulation<Node>(nodes)
            .force("link", d3.forceLink<Node, Link>(links)
                .id(d => d.id)
                .distance(30)
                .strength(1))  // Add back link force with moderate strength
            .force("charge", d3.forceManyBody()
                .strength(-100)  // Reduced repulsion
                .distanceMin(20)
                .distanceMax(200))
            .force("x", d3.forceX()
                .strength(0.15)  // Very gentle x centering
                .x(containerSize.width / 2))
            .force("y", d3.forceY()
                .strength(0.05)  // Very gentle y centering
                .y(containerSize.height / 2))
            .force("collision", d3.forceCollide()
                .radius(20)
                .strength(0.7))
            .alphaDecay(0.01)
            .on("tick", () => {
                const padding = 50;
                // console.log('check')
                // nodes.forEach(node => {
                //     node.x = Math.max(padding, Math.min(containerSize.width - padding, node.x || containerSize.width / 2));
                //     node.y = Math.max(padding, Math.min(containerSize.height - padding, node.y || containerSize.height / 2));
                // });
                setCurrentNodes([...simulationRef.current!.nodes()]);
            });

        return () => simulationRef.current?.stop();
    }, [nodes, links, containerSize]);

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

        const padding = 10;
        const slideShowHeight = 100; // Height of the slideshow
        const bottomPadding = padding + slideShowHeight;

        // Get bounds
        const xs = currentNodes.map(n => n.x || 0);
        const ys = currentNodes.map(n => n.y || 0);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        // Calculate dimensions with padding
        const width = maxX - minX + padding * 2;
        const height = maxY - minY + padding + bottomPadding; // More padding at bottom

        // Calculate scale to fit
        const scale = Math.min(
            containerSize.width / width,
            (containerSize.height - slideShowHeight) / height // Subtract slideshow height
        );

        // Calculate translation to center, but shift up to account for slideshow
        const translateX = (containerSize.width - (maxX + minX) * scale) / 2;
        const translateY = (containerSize.height - slideShowHeight - (maxY + minY) * scale) / 2;

        return { scale, translateX, translateY };
    }, [currentNodes, containerSize]);

    const transform = calculateTransform();

    return (
        <div className="flex-1 flex flex-col relative">
            <div ref={containerRef} className="flex-1">
                <svg width="100%" height="100%" viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}>
                    {links.map((link) => {
                        const source = currentNodes.find(n => n.id === link.source.id);
                        const target = currentNodes.find(n => n.id === link.target.id);
                        if (!source?.x || !target?.x) return null;

                        const x1 = source.x * transform.scale + transform.translateX;
                        const y1 = source.y * transform.scale + transform.translateY;
                        const x2 = target.x * transform.scale + transform.translateX;
                        const y2 = target.y * transform.scale + transform.translateY;

                        return (
                            <line
                                key={`${link.source.id}-${link.target.id}`}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="#999"
                                strokeWidth={2}
                                strokeOpacity={0.6}
                                style={{
                                    transition: 'x1 0.5s ease-in-out, y1 0.5s ease-in-out, x2 0.5s ease-in-out, y2 0.5s ease-in-out'
                                }}
                            />
                        );
                    })}
                    {currentNodes.map((node) => {
                        if (!node.x || !node.y) return null;

                        const cx = node.x * transform.scale + transform.translateX;
                        const cy = node.y * transform.scale + transform.translateY;

                        return (
                            <circle
                                key={node.id}
                                cx={cx}
                                cy={cy}
                                r={15}
                                fill={node.group === 'POI' ? 'blue' : 'red'}
                                stroke="white"
                                strokeWidth={1.5}
                                onClick={() => handleSelect(node.id)}
                            />
                        );
                    })}
                </svg>
            </div>
            <div className="fixed bottom-0 left-0 w-full overflow-auto">
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