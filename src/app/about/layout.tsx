import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sobre mí / About", description: "Tomás Beguan, artista 3D: experiencia, herramientas y formación. / 3D artist: experience, tools and education.", alternates: { canonical: "/about" } };

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
