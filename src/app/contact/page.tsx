"use client";

import { RetroContainer } from "@/components/RetroContainer";
import { RetroButton } from "@/components/RetroButton";
import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Instagram, Youtube, Palette, Mail } from "lucide-react";

export default function ContactPage() {
    const { language } = useLanguage();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        honey: "", // Honeypot field
    });

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || (language === 'es' ? "Algo salió mal" : "Something went wrong"));
            }

            setStatus("success");
            setFormData({ name: "", email: "", message: "", honey: "" });
        } catch (error: any) {
            setStatus("error");
            setErrorMessage(error.message);
        }
    };

    const t = {
        title: language === 'es' ? "Contacto" : "Contact Me",
        name: language === 'es' ? "Nombre" : "Name",
        namePlaceholder: language === 'es' ? "Tu Nombre" : "Your Name",
        email: language === 'es' ? "Correo Electrónico" : "Email",
        message: language === 'es' ? "Mensaje" : "Message",
        messagePlaceholder: language === 'es' ? "Cuéntame sobre tu proyecto..." : "Tell me about your project...",
        send: language === 'es' ? "Enviar Mensaje" : "Send Message",
        sending: language === 'es' ? "Enviando..." : "Sending...",
        successTitle: language === 'es' ? "¡Mensaje Enviado!" : "Message Sent!",
        successDesc: language === 'es' ? "Gracias por contactarme. Te responderé lo antes posible." : "Thanks for reaching out. I'll get back to you soon.",
        sendAnother: language === 'es' ? "Enviar otro" : "Send Another",
        errorTitle: language === 'es' ? "Error al enviar" : "Sending Error",
        alsoFindMe: language === 'es' ? "También puedes encontrarme en" : "Also find me on",
    };

    const socialLinks = [
        { icon: <Instagram size={20} />, label: "Instagram", url: "https://instagram.com/tomasbeguan", color: "hover:text-[#E1306C]" },
        { icon: <Youtube size={20} />, label: "YouTube", url: "https://youtube.com/@tomasbeguan", color: "hover:text-[#FF0000]" },
        { icon: <Palette size={20} />, label: "ArtStation", url: "https://www.artstation.com/tomasbeguan", color: "hover:text-[#13AFF0]" },

    ];

    return (
        <main className="w-full min-h-screen md:fixed md:inset-0 md:h-full md:overflow-hidden flex flex-col items-center justify-start p-2 sm:p-4 pt-4 md:pt-3">
            <RetroContainer title={t.title} className="max-w-xl w-full md:mt-8 mb-3">
                <div className="flex flex-col h-full">
                    <div className="flex-1">
                        {status === "success" ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-6 text-center animate-in fade-in zoom-in duration-300">
                                <div className="text-6xl filter drop-shadow-retro">📨</div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold uppercase font-chicago">{t.successTitle}</h2>
                                    <p className="font-space-grotesk text-gray-600 max-w-sm">{t.successDesc}</p>
                                </div>
                                <RetroButton onClick={() => setStatus("idle")} className="mt-4">
                                    {t.sendAnother}
                                </RetroButton>
                            </div>
                        ) : (
                            <form className="flex flex-col gap-5 p-2" onSubmit={handleSubmit}>
                                <div className="hidden" aria-hidden="true">
                                    <label htmlFor="honey">Don't fill this out if you're human:</label>
                                    <input
                                        type="text"
                                        name="honey"
                                        id="honey"
                                        tabIndex={-1}
                                        value={formData.honey}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="name" className="font-bold uppercase text-xs tracking-widest text-gray-500">{t.name}</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="border-2 border-black p-3 font-mono text-base focus:outline-none focus:shadow-retro-sm transition-all disabled:bg-gray-100 bg-white"
                                        placeholder={t.namePlaceholder}
                                        disabled={status === "loading"}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="email" className="font-bold uppercase text-xs tracking-widest text-gray-500">{t.email}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="border-2 border-black p-3 font-mono text-base focus:outline-none focus:shadow-retro-sm transition-all disabled:bg-gray-100 bg-white"
                                        placeholder="your@email.com"
                                        disabled={status === "loading"}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="message" className="font-bold uppercase text-xs tracking-widest text-gray-500">{t.message}</label>
                                    <textarea
                                        name="message"
                                        id="message"
                                        rows={5}
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="border-2 border-black p-3 font-mono text-base focus:outline-none focus:shadow-retro-sm transition-all resize-none disabled:bg-gray-100 bg-white"
                                        placeholder={t.messagePlaceholder}
                                        disabled={status === "loading"}
                                    ></textarea>
                                </div>

                                {status === "error" && (
                                    <div className="bg-red-50 border-2 border-red-500 p-4 text-red-700 animate-in slide-in-from-top-2 duration-300">
                                        <p className="font-bold uppercase text-xs mb-1">{t.errorTitle}</p>
                                        <p className="text-sm font-mono">{errorMessage}</p>
                                    </div>
                                )}

                                <div className="flex justify-end pt-4">
                                    <RetroButton
                                        type="submit"
                                        disabled={status === "loading"}
                                        className={status === "loading" ? "opacity-70" : ""}
                                    >
                                        {status === "loading" ? t.sending : t.send}
                                    </RetroButton>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Social Media Footer */}
                    <div className="mt-8 pt-6 border-t-2 border-black/10 flex flex-col items-center gap-4">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                            {t.alsoFindMe}
                        </p>
                        <div className="flex gap-6">
                            {socialLinks.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex flex-col items-center gap-1 transition-all duration-300 group ${link.color}`}
                                    title={link.label}
                                >
                                    <div className="p-3 border-2 border-black bg-white shadow-retro-sm group-hover:-translate-y-1 group-active:translate-y-0 transition-transform">
                                        {link.icon}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                        {link.label}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </RetroContainer>
        </main>
    );
}
