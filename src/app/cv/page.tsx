"use client";

import { RetroContainer } from "@/components/RetroContainer";
import { useLanguage } from "@/context/LanguageContext";
import { Instagram, Youtube, Palette, Mail, Globe } from "lucide-react";

export default function CVPage() {
    const { language } = useLanguage();

    const socialLinks = [
        { icon: <Instagram size={18} />, label: "Instagram", url: "https://instagram.com/tomasbeguan" },
        { icon: <Youtube size={18} />, label: "YouTube", url: "https://youtube.com/@tomasbeguan" },
        { icon: <Palette size={18} />, label: "ArtStation", url: "https://www.artstation.com/tomasbeguan" },
    ];

    const ContactBlock = (
        <div className="border-2 border-black bg-white shadow-retro p-4 space-y-4">
            <h2 className="text-xl font-chicago border-b-2 border-black pb-1 mb-2">
                {language === 'es' ? "Contacto" : "Contact"}
            </h2>
            <div className="flex flex-col gap-3 font-space-grotesk text-sm">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Website</p>
                    <a href="https://tomasbeguan.com" target="_blank" rel="noopener noreferrer" className="text-base font-bold underline underline-offset-2 hover:text-blue-600 transition-colors">
                        tomasbeguan.com
                    </a>
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Social</p>
                    <p className="text-base font-bold">@TomasBeguan</p>
                </div>
            </div>
        </div>
    );

    const SkillsBlock = (
        <div className="border-2 border-black bg-white shadow-retro p-4">
            <h2 className="text-xl font-chicago border-b-2 border-black pb-1 mb-3">
                {language === 'es' ? "Habilidades" : "Skills"}
            </h2>
            <div className="space-y-4 font-space-grotesk text-sm font-medium">
                <div>
                    <h4 className="font-bold border-b border-black/20 pb-1 mb-1">Software</h4>
                    <p className="leading-relaxed">
                        Blender, After Effects, Affinity, Davinci Resolve, Substance Painter, Photoshop, Illustrator, Premiere, Figma
                    </p>
                </div>
                <div>
                    <h4 className="font-bold border-b border-black/20 pb-1 mb-1">{language === 'es' ? "Especialidades" : "Specialties"}</h4>
                    <p>{language === 'es' ? "Animación, Modelado, Shading" : "Animation, Modeling, Shading"}</p>
                </div>
                <div>
                    <h4 className="font-bold border-b border-black/20 pb-1 mb-1">{language === 'es' ? "Idiomas" : "Languages"}</h4>
                    <p>{language === 'es' ? "Español (Nativo), Inglés (B1)" : "Spanish (Native), English (B1)"}</p>
                </div>
            </div>
        </div>
    );

    return (
        <main className="w-full min-h-screen md:fixed md:inset-0 md:h-full md:overflow-hidden flex flex-col items-center justify-start p-2 sm:p-4 pt-4 md:pt-3">
            <RetroContainer
                title="Curriculum Vitae"
                hideBack={true}
                className="md:flex-1 md:min-h-0 md:mt-8 mb-3"
            >
                <div className="flex flex-col md:flex-row gap-8 items-start w-full p-4">
                    {/* Left Column - Profile & Skills */}
                    <div className="w-full md:w-1/3 space-y-6">
                        <div className="border-2 border-black bg-white shadow-retro p-2 print:shadow-none">
                            <img src="/uploads/dithered-image.png" alt="Tomas Beguan" className="w-full border-2 border-black" />
                        </div>

                        {SkillsBlock}
                        {ContactBlock}
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
                            <p>
                                {language === 'es' ? (
                                    <>¡Hola! Soy Tomás. <strong>Artista 3D</strong> con pasión por transformar ideas en realidad visual tangible. Me especializo principalmente en <strong>animación, modelado y shading con dominio del pipeline completo.</strong></>
                                ) : (
                                    <>Hi! I'm Tomás. I'm a <strong>3D artist</strong> with a passion for turning ideas into tangible visual reality. I specialize primarily in <strong>animation, modeling and shading with a thorough understanding of the entire production pipeline.</strong></>
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
                                    <p className="text-sm font-bold text-gray-500 mb-2">2021 - {language === 'es' ? "Presente" : "Present"}</p>
                                    <ul className="list-[square] list-inside font-space-grotesk space-y-1 text-base leading-tight">
                                        <li>{language === 'es' ? "Dirección y producción de contenido multimedia animado y visuales 3D para diversos clientes y marcas." : "Direction and production of animated multimedia content and 3D visuals for various clients and brands."}</li>
                                        <li>{language === 'es' ? "Modelado y preparado de piezas para impresión 3D." : "Modeling and preparation of pieces for 3D printing."}</li>
                                        <li>{language === 'es' ? "Dominio completo del pipeline para animación 3D." : "Complete mastery of the 3D animation pipeline."}</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-black pl-4">
                                    <h4 className="text-xl font-bold font-space-grotesk">Motion Designer Freelance</h4>
                                    <p className="text-sm font-bold text-gray-500 mb-2">2018 - 2021</p>
                                    <ul className="list-[square] list-inside font-space-grotesk space-y-1 text-base leading-tight">
                                        <li>{language === 'es' ? "Creación de contenido multimedia animado para diversos clientes." : "Production of animated multimedia content for various clients."}</li>
                                        <li>{language === 'es' ? "Dirección y creación de visuales ilustradas." : "Direction and production of illustrated visuals."}</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-black pl-4">
                                    <h4 className="text-xl font-bold font-space-grotesk">Web Developer Freelance</h4>
                                    <p className="text-sm font-bold text-gray-500 mb-2">2017 - 2019</p>
                                    <ul className="list-[square] list-inside font-space-grotesk space-y-1 text-base leading-tight">
                                        <li>{language === 'es' ? "Desarrollo de páginas web para clientes particulares." : "Website development for individual clients."}</li>
                                        <li>{language === 'es' ? "Encargado del diseño, maquetación, programación y marketing." : "Responsible for design, layout, programming, and marketing."}</li>
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
                                    <h4 className="text-xl font-bold font-space-grotesk">{language === 'es' ? "Formación Complementaria en diseño 3D" : "Continuing Education in 3D Design"}</h4>
                                    <p className="text-sm font-bold text-gray-500 mb-2"><a href="https://www.odin3d.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-black transition-colors">Odin3D</a>, Online School. 2020. 300hs.</p>
                                </div>
                                <div className="border-l-4 border-black pl-4 ">
                                    <h4 className="text-xl font-bold font-space-grotesk">{language === 'es' ? "Técnico superior en desarrollo web" : "Senior Web Developer."}</h4>
                                    <p className="text-sm font-bold text-gray-500 mb-2"><a href="https://www.lametro.edu.ar/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-black transition-colors">La Metro</a>, Escuela de diseño. 2019, Argentina.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </RetroContainer>
        </main>
    );
}
