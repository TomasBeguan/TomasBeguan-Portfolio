"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Stage, Html, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import * as THREE from "three";


interface ThumbnailModelProps {
    url: string;
    isVisible: boolean;
}

function ThumbnailModel({ url, isVisible }: ThumbnailModelProps) {
    const touchRef = useRef({
        startX: 0,
        startY: 0,
        dragging: false,
    });

    const { scene } = useGLTF(url);
    const ref = useRef<THREE.Group>(null);
    const inputRef = useRef({ rotX: 0, rotY: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!isMobile) return;

        const handleTouchStart = (e: TouchEvent) => {
            const t = e.touches[0];
            touchRef.current.startX = t.clientX;
            touchRef.current.startY = t.clientY;
            touchRef.current.dragging = true;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!touchRef.current.dragging) return;

            const t = e.touches[0];
            const dx = t.clientX - touchRef.current.startX;
            const dy = t.clientY - touchRef.current.startY;

            const rotY = dx * 0.005;
            const rotX = dy * 0.005;

            inputRef.current.rotY = THREE.MathUtils.clamp(rotY, -0.3, 0.3);
            inputRef.current.rotX = THREE.MathUtils.clamp(rotX, -0.6, 0.6);
        };

        const handleTouchEnd = () => {
            touchRef.current.dragging = false;
        };

        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchmove", handleTouchMove, { passive: true });
        window.addEventListener("touchend", handleTouchEnd);

        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [isMobile]);

    useFrame((state) => {
        if (!ref.current || !isVisible) return;

        const wiggleRotY = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        const wigglePosY = Math.sin(state.clock.elapsedTime * 2) * 0.01;

        let targetRotX = 0;
        let targetRotY = 0;

        if (isMobile) {
            targetRotX = inputRef.current.rotX;
            targetRotY = inputRef.current.rotY;
        } else {
            targetRotY = state.pointer.x * 0.5;
            targetRotX = -state.pointer.y * 0.5;
        }

        ref.current.rotation.y = THREE.MathUtils.lerp(
            ref.current.rotation.y,
            targetRotY + wiggleRotY,
            0.1
        );

        ref.current.rotation.x = THREE.MathUtils.lerp(
            ref.current.rotation.x,
            targetRotX,
            0.1
        );

        ref.current.position.y = wigglePosY;
    });

    return (
        <group ref={ref}>
            <primitive object={scene} />
        </group>
    );
}

interface Thumbnail3DViewerProps {
    url: string;
    className?: string;
}

export function Thumbnail3DViewer({ url, className }: Thumbnail3DViewerProps) {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = containerRef.current?.closest('.retro-scrollbar');

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                root: scrollContainer || null,
                threshold: 0,
                // Load slightly before entry and keep alive slightly after exit
                rootMargin: "0px 0px -10% 0px"
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
            {!isVisible ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="animate-spin text-gray-400" size={24} />
                </div>
            ) : (
                <Canvas
                    shadows={false}
                    dpr={[1, 2]} // This handles high-DPR and zoom correctly automatically
                    gl={{ alpha: true, antialias: true }}
                    className="absolute inset-0 w-full h-full"
                >
                    <Suspense fallback={
                        <Html center>
                            <Loader2 className="animate-spin text-gray-400" size={24} />
                        </Html>
                    }>
                        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={15} />
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={2} />
                        <Stage environment="city" intensity={0.2} adjustCamera={1.2} shadows={false}>
                            <ThumbnailModel url={url} isVisible={isVisible} />
                        </Stage>
                    </Suspense>
                </Canvas>
            )}
        </div>
    );
}
