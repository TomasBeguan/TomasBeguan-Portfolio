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
            <RetroContainer title={language === 'es' ? "Curriculum Vitae" : "Curriculum Vitae"} className="md:flex-1 md:min-h-0 md:mt-8 mb-3">
                <div className="flex flex-col md:flex-row gap-8 items-start w-full ">
                    {/* Left Column - Profile & Skills */}
                    <div className="w-full md:w-1/3 space-y-6">
                        <div className="border-2 border-black bg-white shadow-retro p-2">
                            <img src="/uploads/dithered-image.png" alt="Tomas Beguan" className="w-full border-2 border-black" />
                        </div>


                        {/* Contacto */}
                        <div className="border-2 border-black bg-white shadow-retro p-4 space-y-4">
                            <h2 className="text-xl font-chicago border-b-2 border-black pb-1 mb-2">
                                {language === 'es' ? "Contacto" : "Contact"}
                            </h2>
                            <div className="flex flex-col gap-2">
                                <Link href="/contact" className="w-full">
                                    <RetroButton className="w-full justify-center">
                                        {language === 'es' ? "Enviar Mensaje" : "Send Message"}
                                    </RetroButton>
                                </Link>
                                <Link href="/portfolio" className="w-full">
                                    <RetroButton className="w-full justify-center bg-black text-white hover:bg-white hover:text-black">
                                        {language === 'es' ? "Ver Trabajos" : "View Work"}
                                    </RetroButton>
                                </Link>
                            </div>
                        </div>


                        <div className="border-2 border-black bg-white shadow-retro p-4">
                            <h2 className="text-xl font-chicago border-b-2 border-black pb-1 mb-3">
                                {language === 'es' ? "Habilidades" : "Skills"}
                            </h2>
                            <div className="space-y-4 font-space-grotesk text-sm font-medium">
                                <div>
                                    <h4 className="font-bold border-b border-black/20 pb-1 mb-1">Software</h4>
                                    <p>Blender, Substance Painter, After Effects, Davinci Resolve, Photoshop, Affinity, Figma</p>
                                </div>
                                <div>
                                    <h4 className="font-bold border-b border-black/20 pb-1 mb-1">{language === 'es' ? "Especialidades" : "Specialties"}</h4>
                                    <p>{language === 'es' ? "Animación, Modelado, Shading" : "Hard Surface Modeling, Shading, Product Animation, Lighting"}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold border-b border-black/20 pb-1 mb-1">{language === 'es' ? "Idiomas" : "Languages"}</h4>
                                    <p>{language === 'es' ? "Español (Nativo), Inglés (Avanzado)" : "Spanish (Native), English (Advanced)"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - CV Content */}
                    <div className="w-full md:w-2/3 space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-ultra tracking-tight mb-1 text-black">Tomás Beguan</h1>
                            <h2 className="text-xl font-space-grotesk font-bold text-gray-600 uppercase tracking-widest border-b-4 border-black pb-4">
                                {language === 'es' ? "Generalista 3D y Animador" : "3D Generalist & Animator"}
                            </h2>
                        </div>

                        <div className="space-y-4 font-space-grotesk font-medium text-lg leading-tight">
                            <h3 className="text-2xl font-chicago border-b-2 border-black pb-1 inline-block">
                                {language === 'es' ? "Perfil" : "Profile"}
                            </h3>
                            <p>
                                {language === 'es' ? (
                                    <>¡Hola! Soy Tomás. <strong>Artista 3D</strong> con pasión por transformar ideas en realidad visual tangible. Me especializo principalmente en <strong>animación, modelado y shading con dominio del pipeline completo.</strong></>
                                ) : (
                                    <>Hey! I'm Tomás. I'm a <strong>digital artist</strong> obsessed with retro aesthetics, brutalism, and old-school technology. I use Blender to create immersive visual experiences that bridge the gap between nostalgia and modernism.</>
                                )}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-chicago border-b-2 border-black pb-1 inline-block">
                                {language === 'es' ? "Experiencia" : "Experience"}
                            </h3>

                            <div className="space-y-6">
                                <div className="border-l-4 border-black pl-4 leading-tight">
                                    <h4 className="text-xl font-bold font-space-grotesk">Freelance 3D Artist</h4>
                                    <p className="text-sm font-bold text-gray-500 mb-2">2020 - {language === 'es' ? "Presente" : "Present"}</p>
                                    <ul className="list-[square] list-inside font-space-grotesk space-y-1 text-base leading-tight">
                                        <li>{language === 'es' ? "Creación de modelos 3D y piezas animadas para diversos clientes y marcas." : "Creation of high-quality 3D models and animations for various clients and brands."}</li>
                                        <li>{language === 'es' ? "Especialización en diseño de producto, texturizado procedural y renderizado realista/estilizado." : "Specialization in product design, procedural texturing, and realistic/stylized rendering."}</li>
                                        <li>{language === 'es' ? "Gestión completa del workflow: desde la concepción de la idea y modelado, hasta el renderizado final y post-producción." : "Complete workflow management: from concept and modeling to final render and post-production."}</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-black pl-4">
                                    <h4 className="text-xl font-bold font-space-grotesk">Visual Designer</h4>
                                    <p className="text-sm font-bold text-gray-500 mb-2">2018 - 2020</p>
                                    <ul className="list-[square] list-inside font-space-grotesk space-y-1 text-base leading-tight">
                                        <li>{language === 'es' ? "Diseño gráfico, ilustración digital y desarrollo de identidad visual." : "Graphic design, digital illustration, and visual identity development."}</li>
                                        <li>{language === 'es' ? "Exploración de estéticas retro y brutalismo en medios digitales." : "Exploration of retro aesthetics and brutalism in digital media."}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-chicago border-b-2 border-black pb-1 inline-block">
                                {language === 'es' ? "Educación" : "Education"}
                            </h3>

                            <div className="space-y-4">
                                <div className="border-l-4 border-black pl-4 ">
                                    <h4 className="text-xl font-bold font-space-grotesk">{language === 'es' ? "Autodidacta / Formación Continua" : "Self-taught / Continuous Education"}</h4>
                                    <p className="text-sm font-bold text-gray-500 mb-2">3D Workflow & Digital Art</p>
                                    <p className="font-space-grotesk text-base leading-tight">
                                        {language === 'es'
                                            ? "Desarrollo de habilidades avanzadas en modelado, texturizado, rigging y animación a través de proyectos personales desafiantes y cursos especializados de la industria."
                                            : "Development of advanced skills in modeling, texturing, rigging, and animation through challenging personal projects and specialized industry courses."}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </RetroContainer>
        </main>
    );
}
