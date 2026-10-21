import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contacto / Contact", description: "Escribime para proyectos de animación y modelado 3D. / Get in touch for 3D animation and modeling projects.", alternates: { canonical: "/contact" } };

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
