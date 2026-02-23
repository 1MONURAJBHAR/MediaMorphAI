//export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const videos = await prisma.video.findMany({
            orderBy: { createdAt: "desc" }
        })
         return NextResponse.json(videos, { status: 200 });
    } catch (error) {
        console.error("❌ Error fetching videos:", error);
        return NextResponse.json({ error: "Error fetching videos" }, { status: 500 });
    } finally {
        await prisma.$disconnect()
    }
}