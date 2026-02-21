import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
  [key: string]: any;
}

function configureCloudinary() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary environment variables are missing");
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    configureCloudinary();

    const formData = await request.formData();
    
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const originalSize = formData.get("originalSize") as string;
      
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

      const result = await new Promise<CloudinaryUploadResult>(
          (resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                  {
                      resource_type: "video",
                      folder: "video-uploads",
                      transformation: [
                          { quality: "auto", fetch_format: "mp4" }
                      ]
                  },
                  (error, result) => {
                      if (error) reject(error);
                      else resolve(result as CloudinaryUploadResult);
                  },
              );

              uploadStream.end(buffer);
          },
      )

      const video = await prisma.video.create({
          data: {
              title,
              description,
              publicId: result.public_id,
              originalSize: originalSize,
              compressedSize: String(result.bytes),
              duration: result.duration || 0,
          }
      })

    return NextResponse.json(video);
    
  } catch (error) {
    console.error("Upload video failed:", error);
    return NextResponse.json({ error: "Upload video failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect()
  }
}
