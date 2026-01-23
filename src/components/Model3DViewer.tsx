"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Stage, useTexture } from "@react-three/drei";
import { Suspense, Component, ErrorInfo, ReactNode, useState, useEffect, useRef } from "react";
import { Loader2, AlertTriangle, Play } from "lucide-react";
import * as THREE from "three";

class ErrorBoundary extends Component<{ children: ReactNode, fallback: ReactNode }, { hasError: boolean, error: Error | null }> {
    constructor(props: { children: ReactNode, fallback: ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("3D Model Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

interface ModelProps {
    url: string;
    textureUrl?: string;
}

function Model({ url, textureUrl }: ModelProps) {
    const { scene } = useGLTF(url);
    const texture = useTexture(textureUrl || "");

    if (textureUrl && texture) {
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;

        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                if (mesh.material) {
                    (mesh.material as THREE.MeshStandardMaterial).map = texture;
                    (mesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
                }
            }
        });
    }

    return <primitive object={scene} />;
}

interface Model3DViewerProps {
    url: string;
    textureUrl?: string;
    altText?: string;
    className?: string;
}

export function Model3DViewer({ url, textureUrl, altText, className }: Model3DViewerProps) {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const isBin = url.toLowerCase().endsWith('.bin');

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    if (isBin) {
        return (
            <div className={`relative w-full aspect-square bg-gray-100 flex flex-col items-center justify-center p-4 text-center border-2 border-red-500 ${className}`}>
                <AlertTriangle className="text-red-500 mb-2" size={32} />
                <p className="text-sm font-bold text-red-600">Invalid File Type</p>
                <p className="text-xs text-gray-600 mt-1">
                    You are trying to view a <b>.bin</b> file directly.
                    <br />
                    Please upload a <b>.glb</b> file instead.
                </p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={`relative w-full aspect-square bg-transparent overflow-hidden ${className}`}>
            {!isVisible ? (
                <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                    <Loader2 className="animate-spin text-gray-400" size={24} />
                    <span className="ml-2 text-xs text-gray-500 font-mono">Waiting for view...</span>
                </div>
            ) : (
                <ErrorBoundary fallback={
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        <AlertTriangle className="text-red-500 mb-2" size={32} />
                        <p className="text-sm font-bold text-red-600">Error Loading Model</p>
                        <p className="text-xs text-gray-600 mt-1">
                            Try using a <b>.glb</b> file.
                            <br />
                            (If using .gltf + .bin, the reference is likely broken)
                        </p>
                    </div>
                }>
                    <Suspense fallback={
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="animate-spin text-gray-400" size={32} />
                        </div>
                    }>
                        <Canvas
                            shadows
                            dpr={[1, 2]}
                            camera={{ fov: 50 }}

                        // Removed preserveDrawingBuffer and high-performance to save context memory
                        >
                            <Stage environment="city" intensity={0.6}>
                                {textureUrl ? (
                                    <Model url={url} textureUrl={textureUrl} />
                                ) : (
                                    <ModelWithoutTexture url={url} />
                                )}
                            </Stage>
                            <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
                        </Canvas>
                    </Suspense>
                </ErrorBoundary>
            )}
            {altText && (
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded pointer-events-none">
                    {altText}
                </div>
            )}
        </div>
    );
}

function ModelWithoutTexture({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}
