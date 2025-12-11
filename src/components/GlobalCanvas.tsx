"use client";

import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import React, { useEffect, useState } from "react";

export const GlobalCanvas = () => {
    const [eventSource, setEventSource] = useState<HTMLElement | undefined>(undefined);

    useEffect(() => {
        setEventSource(document.body);
    }, []);

    return (
        <Canvas
            className="fixed inset-0 pointer-events-none z-20"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100dvh', // Use dynamic viewport height to track mobile URL bar
                pointerEvents: 'none',
                background: 'transparent',
                zIndex: 20
            }}
            shadows={false}
            gl={{ alpha: true, antialias: true }}
            eventSource={eventSource}
        >
            <View.Port />
        </Canvas>
    );
};
