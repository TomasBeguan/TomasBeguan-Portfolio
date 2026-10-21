import type { MetadataRoute } from "next";
import { getActivePosts, getActiveFanzines } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes = ["", "/portfolio", "/about", "/contact", "/diario", "/cv", "/fanzine"].map((route) => ({
        url: `${SITE_URL}${route}`,
        changeFrequency: "monthly" as const,
        priority: route === "" ? 1 : 0.7,
    }));

    const posts = getActivePosts().map((post) => ({
        url: `${SITE_URL}/portfolio/${encodeURIComponent(post.slug || post.id)}`,
        lastModified: post.date ? new Date(post.date) : undefined,
        changeFrequency: "yearly" as const,
        priority: 0.8,
    }));

    const fanzines = getActiveFanzines().map((f) => ({
        url: `${SITE_URL}/fanzine/${encodeURIComponent(f.slug)}`,
        changeFrequency: "yearly" as const,
        priority: 0.5,
    }));

    return [...staticRoutes, ...posts, ...fanzines];
}
