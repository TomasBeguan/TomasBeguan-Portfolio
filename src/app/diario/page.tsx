import type { Metadata } from "next";
import { DiarioView } from "@/components/pages/DiarioView";
import { getDiary } from "@/lib/data";

// Data is read on the server at build time: no loading spinner, no extra API request.
export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "Diario / Diary",
    description: "Diario de dibujos de Tomás Beguan. / Sketch diary by Tomás Beguan.",
    alternates: { canonical: "/diario" },
};

export default function DiarioPage() {
    return <DiarioView diaryData={getDiary()} />;
}
