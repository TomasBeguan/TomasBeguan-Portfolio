import type { Metadata } from "next";

export const metadata: Metadata = { title: "CV", description: "Currículum de Tomás Beguan, artista 3D. / Resume of Tomás Beguan, 3D artist.", alternates: { canonical: "/cv" } };

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
