"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Stage, Html, View, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import * as THREE from "three";

function ScissorController({ track }: { track: React.RefObject<HTMLElement | null> }) {
    const { gl, scene } = useThree();

    useEffect(() => {
        // Mobile Layout Change: Native Scroll.
        // We disable strict clipping on mobile because it doesn't work as expected
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) return;

        // onBeforeRender runs synchronously right before drawing starts
        scene.onBeforeRender = () => {
            const el = track.current;
            if (!el) {
                gl.setScissorTest(false);
                return;
            }

            const pixelRatio = gl.getPixelRatio();
            const rect = el.getBoundingClientRect();
            const scrollContainer = el.closest('.retro-scrollbar');

            let clipRect;

            if (scrollContainer) {
                // If inside a scrollable container, clip to the intersection
                const scrollRect = scrollContainer.getBoundingClientRect();

                // Intersection (clipping window)
                const top = Math.max(rect.top, scrollRect.top);
                const bottom = Math.min(rect.bottom, scrollRect.bottom);
                const left = Math.max(rect.left, scrollRect.left);
                const right = Math.min(rect.right, scrollRect.right);

                clipRect = {
                    top,
                    bottom,
                    left,
                    right,
                    width: Math.max(0, right - left),
                    height: Math.max(0, bottom - top)
                };
            } else {
                // If not in a scrollable container (e.g., portfolio cards), clip to element bounds
                clipRect = {
                    top: rect.top,
                    bottom: rect.bottom,
                    left: rect.left,
                    right: rect.right,
                    width: rect.width,
                    height: rect.height
                };
            }

            // Universal Scissor Logic
            // We rely on GlobalCanvas having height: 100dvh to track the mobile viewport correctly.
            // This means canvasRect.bottom should always match the visual viewport bottom.
            const canvasRect = gl.domElement.getBoundingClientRect();
            const scissorBottom = (canvasRect.bottom - clipRect.bottom) * pixelRatio;

            const scissorLeft = (clipRect.left - canvasRect.left) * pixelRatio;
            const scissorWidth = clipRect.width * pixelRatio;
            const scissorHeight = clipRect.height * pixelRatio;

            gl.setScissorTest(true);
            gl.setScissor(scissorLeft, scissorBottom, scissorWidth, scissorHeight);
        };

        // Cleanup
        return () => {
            scene.onBeforeRender = () => { }; // Reset to an empty function
            gl.setScissorTest(false); // Also disable scissor test on cleanup
        };

    }, [gl, scene, track]); // Rerun if these change

    return null;
}


interface ThumbnailModelProps {
    url: string;
    isVisible: boolean;
}

function ThumbnailModel({ url, isVisible }: ThumbnailModelProps) {


    const touchRef = useRef({
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        dragging: false,
    });


    const { scene } = useGLTF(url);
    const ref = useRef<THREE.Group>(null);

    const inputRef = useRef({ rotX: 0, rotY: 0 }); // Stores Mouse (Desktop) or Gyro (Mobile) target
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

            // Sensibilidad (ajustable)
            const rotY = dx * 0.005;
            const rotX = dy * 0.005;

            inputRef.current.rotY = THREE.MathUtils.clamp(rotY, -0.6, 0.6);
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
        const wigglePosY = Math.sin(state.clock.elapsedTime * 1) * 0.02;

        let targetRotX = 0;
        let targetRotY = 0;

        if (isMobile) {
            // Mobile: Touch drag
            targetRotX = inputRef.current.rotX;
            targetRotY = inputRef.current.rotY;
        } else {
            // Desktop: Mouse
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

    // Monkey patch removed in favor of ScissorController
    // This allows separating Viewport (placement) from Scissor (clipping)
    // to prevent distortion when scrolling


    useEffect(() => {
        const scrollContainer = containerRef.current?.closest('.retro-scrollbar');

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                root: scrollContainer || null,
                threshold: 0,
                rootMargin: "-20px 0px -20px 0px" // Hide slightly before edges to prevent spill
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
                <View track={containerRef as any} className="absolute inset-0 w-full h-full overflow-hidden">
                    <Suspense fallback={
                        <Html center>
                            <div className="flex items-center justify-center">
                                <Loader2 className="animate-spin text-gray-400" size={24} />
                            </div>
                        </Html>
                    }>
                        <ScissorController track={containerRef} />
                        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={15} />
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
                        <Stage environment="city" intensity={0.2} adjustCamera={1.2} shadows={false}>
                            <ThumbnailModel url={url} isVisible={isVisible} />
                        </Stage>
                    </Suspense>
                </View>
            )}
        </div>
    );
}
