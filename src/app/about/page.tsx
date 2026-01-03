"use client";

import { RetroContainer } from "@/components/RetroContainer";
import { RetroButton } from "@/components/RetroButton";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
//import { BayerDitherImage } from "@/components/BayerDitherImage";

export default function AboutPage() {
    const { language } = useLanguage();

    return (
        <main className="w-full min-h-screen md:fixed md:inset-0 md:h-full md:overflow-hidden flex flex-col items-center justify-start p-2 sm:p-4 pt-4 md:pt-3">
            <RetroContainer title={language === 'es' ? "Sobre Mí" : "About Me"} className="md:flex-1 md:min-h-0 md:mt-8 mb-3">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="  border-2 border-black bg-gray-200 shadow-retro-sm">
                        <img src="/uploads/dithered-image.png" alt="Tomas Beguan" />
                        {/*<BayerDitherImage
                        //    src="/uploads/02.jpg"
                        //    alt="Tomas Beguan"
                        ///>*/}
                    </div>
                    <div className="flex-1 space-y-4">
                        <h1 className="text-3xl font-bold uppercase border-b-2 border-black pb-2 inline-block">Tomas Beguan</h1>
                        <h2 className="text-xl text-gray-600">
                            {language === 'es' ? "Diseñador 3D y Artista Visual" : "3D Designer & Visual Artist"}
                        </h2>

                        <div className="text-lg space-y-4 font-medium">
                            <p>
                                {language === 'es'
                                    ? "¡Hola! Soy un artista digital obsesionado con la estética retro, el brutalismo y la tecnología de la vieja escuela."
                                    : "Hi! I'm a digital artist obsessed with retro aesthetics, brutalism, and old-school technology."}
                            </p>
                            <p>
                                {language === 'es'
                                    ? "Uso Blender, como principal herramienta, para crear experiencias visuales inmersivas que unen nostalgia y modernismo."
                                    : "I use Blender to create immersive visual experiences that bridge the gap between nostalgia and modernism."}
                            </p>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <Link href="/contact">
                                <RetroButton>
                                    {language === 'es' ? "Contáctame" : "Contact Me"}
                                </RetroButton>
                            </Link>
                            <Link href="/portfolio">
                                <RetroButton className="bg-black text-white hover:bg-white hover:text-black">
                                    {language === 'es' ? "Ver Trabajos" : "View Work"}
                                </RetroButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </RetroContainer>
        </main>
    );
}
