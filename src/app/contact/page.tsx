"use client";

import { RetroContainer } from "@/components/RetroContainer";
import { RetroButton } from "@/components/RetroButton";
import React, { useState } from "react";

export default function ContactPage() {
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
                throw new Error(data.error || "Something went wrong");
            }

            setStatus("success");
            setFormData({ name: "", email: "", message: "", honey: "" });
        } catch (error: any) {
            setStatus("error");
            setErrorMessage(error.message);
        }
    };

    return (
        <main className="w-full min-h-screen md:fixed md:inset-0 md:h-full md:overflow-hidden flex flex-col items-center justify-start p-2 sm:p-4 pt-4 md:pt-3">
            <RetroContainer title="Contact Me" className="max-w-xl md:flex-1 md:min-h-0 md:mt-8 mb-3">
                {status === "success" ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                        <div className="text-4xl">📨</div>
                        <h2 className="text-xl font-bold uppercase">Message Sent!</h2>
                        <p>Thanks for reaching out. I'll get back to you soon.</p>
                        <RetroButton onClick={() => setStatus("idle")}>Send Another</RetroButton>
                    </div>
                ) : (
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        {/* Honeypot Field - Hidden from users */}
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

                        <div className="flex flex-col gap-1">
                            <label htmlFor="name" className="font-bold uppercase text-sm">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="border-2 border-black p-2 font-mono focus:outline-none focus:shadow-retro-sm transition-shadow disabled:bg-gray-100"
                                placeholder="Your Name"
                                disabled={status === "loading"}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="font-bold uppercase text-sm">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="border-2 border-black p-2 font-mono focus:outline-none focus:shadow-retro-sm transition-shadow disabled:bg-gray-100"
                                placeholder="your@email.com"
                                disabled={status === "loading"}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="message" className="font-bold uppercase text-sm">Message</label>
                            <textarea
                                name="message"
                                id="message"
                                rows={5}
                                required
                                value={formData.message}
                                onChange={handleChange}
                                className="border-2 border-black p-2 font-mono focus:outline-none focus:shadow-retro-sm transition-shadow resize-none disabled:bg-gray-100"
                                placeholder="Tell me about your project..."
                                disabled={status === "loading"}
                            ></textarea>
                        </div>

                        {status === "error" && (
                            <div className="text-red-600 font-bold text-sm bg-red-100 p-2 border border-red-400">
                                {errorMessage}
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <RetroButton type="submit" disabled={status === "loading"}>
                                {status === "loading" ? "Sending..." : "Send Message"}
                            </RetroButton>
                        </div>
                    </form>
                )}
            </RetroContainer>
        </main>
    );
}
