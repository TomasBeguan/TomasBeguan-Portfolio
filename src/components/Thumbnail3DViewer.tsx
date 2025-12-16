"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Stage, Html, View, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import * as THREE from "three";

function ScissorController({ track }: { track: React.RefObject<HTMLElement | null> }) {
    const { gl, scene } = useThree();
    const rectRef = useRef<DOMRect | null>(null);
    const scrollRectRef = useRef<DOMRect | null>(null);

    // 1. Eliminamos el ref de smoothScissor porque causa el retraso

    useEffect(() => {
        const el = track.current;
        if (!el) return;

        // Actualizamos las coordenadas del DOM
        const updateRects = () => {
            rectRef.current = el.getBoundingClientRect();
            const scrollContainer = el.closest(".retro-scrollbar") as HTMLElement | null;
            scrollRectRef.current = scrollContainer
                ? scrollContainer.getBoundingClientRect()
                : null;
        };

        updateRects();
        // Usamos 'scroll' en captura y pasivo para mayor precisión
        window.addEventListener("scroll", updateRects, { capture: true, passive: true });
        window.addEventListener("resize", updateRects);

        // Observer opcional para detectar cambios en el DOM que no son scroll/resize
        const observer = new ResizeObserver(updateRects);
        observer.observe(el);
        const scrollNode = el.closest(".retro-scrollbar");
        if (scrollNode) observer.observe(scrollNode);

        return () => {
            window.removeEventListener("scroll", updateRects);
            window.removeEventListener("resize", updateRects);
            observer.disconnect();
        };
    }, [track]);

    useEffect(() => {
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) return;

        scene.onBeforeRender = () => {
            const rect = rectRef.current;
            const scrollRect = scrollRectRef.current;

            if (!rect) return;

            const pixelRatio = gl.getPixelRatio();

            // Cálculo de la intersección (Clipping)
            let clipRect;
            if (scrollRect) {
                // Calculamos la intersección entre la tarjeta y el contenedor de scroll
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
                    height: Math.max(0, bottom - top),
                };
            } else {
                clipRect = rect;
            }

            // Si el ancho o alto es 0, no dibujamos nada para ahorrar recursos
            if (clipRect.width <= 0 || clipRect.height <= 0) {
                gl.setScissorTest(false);
                return;
            }

            gl.setScissorTest(true);

            const canvasHeight = gl.domElement.height / pixelRatio;

            // 2. Aplicamos cálculo directo sin interpolación (EASE)
            const scissorLeft = clipRect.left * pixelRatio;
            const scissorBottom = (canvasHeight - clipRect.bottom) * pixelRatio;
            const scissorWidth = clipRect.width * pixelRatio;
            const scissorHeight = clipRect.height * pixelRatio;

            // 3. SetScissor instantáneo para que coincida perfectamente con el View
            gl.setScissor(scissorLeft, scissorBottom, scissorWidth, scissorHeight);
        };

        return () => {
            scene.onBeforeRender = () => { };
            gl.setScissorTest(false);
        };
    }, [gl, scene, track]);

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
