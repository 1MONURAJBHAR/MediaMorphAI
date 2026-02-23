import cloudinary from "cloudinary";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  const { publicId } = await req.json();

  try {
    const result = await cloudinary.v2.api.resource(publicId, {
      resource_type: "video",
      transformation: [{ quality: "auto:eco", fetch_format: "mp4" }],
    });

    //REAL compressed size from eager transformation
    const derivedBytes = result.derived?.[0]?.bytes;
    //Estimated compressed bytes
    const estimatedCompressedBytes = Math.round(result.bytes * 0.4);

    return NextResponse.json({
      originalBytes: result.bytes,
      compressedBytes: derivedBytes ?? result.bytes,
      // compressedBytes: result.derived?.[0]?.bytes ?? null,
    });
  } catch (error: any) {
    // Handle Cloudinary "still processing"
    if (error?.http_code === 423) {
      return NextResponse.json(
        { message: "Video is still processing. Try again shortly." },
        { status: 202 },
      );
    }

    console.error("Cloudinary error:", error);
    return NextResponse.json(
      { message: "Failed to fetch video metadata" },
      { status: 500 },
    );
  }
}
