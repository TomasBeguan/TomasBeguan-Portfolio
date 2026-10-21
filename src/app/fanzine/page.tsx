import type { Metadata } from "next";
import { FanzineList } from "@/components/pages/FanzineList";
import { getActiveFanzines } from "@/lib/data";

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "Fanzines",
    alternates: { canonical: "/fanzine" },
};

export default function FanzinesPage() {
    return <FanzineList fanzines={getActiveFanzines()} />;
}
