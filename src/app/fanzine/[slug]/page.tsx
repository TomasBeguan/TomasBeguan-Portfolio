import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FanzineViewer } from "@/components/pages/FanzineViewer";
import { getActiveFanzines } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
    return getActiveFanzines().map((f) => ({ slug: f.slug }));
}

function findFanzine(slug: string) {
    const decoded = decodeURIComponent(slug);
    return getActiveFanzines().find((f) => f.slug === decoded);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const fanzine = findFanzine(slug);
    if (!fanzine) return {};
    return {
        title: `${fanzine.title} — Fanzine`,
        description: `Fanzine "${fanzine.title}" de ${fanzine.author}.`,
        alternates: { canonical: `/fanzine/${fanzine.slug}` },
    };
}

export default async function FanzineViewerPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const fanzine = findFanzine(slug);
    if (!fanzine) notFound();
    return <FanzineViewer fanzine={fanzine} />;
}
