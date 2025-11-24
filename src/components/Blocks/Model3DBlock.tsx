"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture, Center, Stage } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import * as THREE from "three";

interface ModelProps {
    url: string;
    textureUrl?: string;
}

function Model({ url, textureUrl }: ModelProps) {
    const { scene } = useGLTF(url);

    // Load texture if provided
    const texture = useTexture(textureUrl || "/placeholder-texture.png"); // Dummy path to avoid hook error, handled below

    useEffect(() => {
        if (textureUrl && texture) {
            texture.flipY = false; // GLTF usually expects this false, but depends on model
            texture.colorSpace = THREE.SRGBColorSpace;

            scene.traverse((child: any) => {
                if (child.isMesh) {
                    child.material.map = texture;
                    child.material.needsUpdate = true;
                }
            });
        }
    }, [scene, texture, textureUrl]);

    return <primitive object={scene} />;
}

// Wrapper to handle conditional hook execution
function ModelWrapper({ url, textureUrl }: ModelProps) {
    if (!url) return null;

    // If we have a texture, we use the component that calls useTexture
    // If not, we use a simpler one or just pass undefined/null which useTexture might not like
    // Actually, useTexture throws if url is invalid.

    return (
        <Suspense fallback={<mesh><boxGeometry /><meshStandardMaterial color="gray" wireframe /></mesh>}>
            {textureUrl ? <ModelWithTexture url={url} textureUrl={textureUrl} /> : <ModelWithoutTexture url={url} />}
        </Suspense>
    );
}

function ModelWithTexture({ url, textureUrl }: { url: string, textureUrl: string }) {
    const { scene } = useGLTF(url);
    const texture = useTexture(textureUrl);

    useEffect(() => {
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;
        scene.traverse((child: any) => {
            if (child.isMesh) {
                child.material.map = texture;
                child.material.needsUpdate = true;
            }
        });
    }, [scene, texture]);

    return <primitive object={scene} />;
}

function ModelWithoutTexture({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}

export function Model3DBlock({ url, textureUrl }: ModelProps) {
    if (!url) return <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">No Model URL</div>;

    return (
        <div className="w-full aspect-square relative cursor-grab active:cursor-grabbing">
            <Canvas gl={{ alpha: true, preserveDrawingBuffer: true }} camera={{ position: [0, 0, 5], fov: 50 }}>
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.6}>
                        <ModelWrapper url={url} textureUrl={textureUrl} />
                    </Stage>
                    <OrbitControls makeDefault autoRotate autoRotateSpeed={1} />
                </Suspense>
            </Canvas>
        </div>
    );
}
