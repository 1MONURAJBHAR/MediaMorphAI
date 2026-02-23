//Flow of video upload
/*Frontend (Browser)
 ├── gets signed upload params
 ├── uploads video directly to Cloudinary
 └── sends metadata to backend

Backend (Next.js + Prisma)
 ├── signs upload request
 └── saves video metadata (public_id, duration, etc.)

Cloudinary
 ├── stores original video once
 └── compresses dynamically at delivery */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    //  Parse JSON body
    const body = await req.json();

    const {
      title,
      description,
      publicId,
      originalSize,
      compressedSize,
      duration,
    } = body;

    //  Strong validation
    if (
      !title ||
      !publicId ||
      typeof originalSize !== "number" ||
      typeof compressedSize !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid or missing required fields" },
        { status: 400 },
      );
    }

    //  Optional sanity check (compressed should be smaller)
    if (compressedSize > originalSize) {
      return NextResponse.json(
        { error: "Compressed size cannot be larger than original size" },
        { status: 400 },
      );
    }

    //  Save metadata only (NO FILES)
    const video = await prisma.video.create({
      data: {
        userId, // ownership
        title: title.trim(),
        description: description?.trim() || "",
        publicId,
        originalSize: originalSize,
        compressedSize: compressedSize,
        duration: duration ?? 0,
      },
    });

    return NextResponse.json({ success: true, video }, { status: 201 });
  } catch (error) {
    console.error(" Video metadata save failed:", error);

    return NextResponse.json(
      { error: "Failed to save video metadata" },
      { status: 500 },
    );
  }
}



/*import { NextRequest, NextResponse } from "next/server";
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

    return NextResponse.json(
      {
        success: true,
        video,
      },
      { status: 200 },
    );
    
  } catch (error) {
    console.error("Upload video failed:", error);
    return NextResponse.json({ error: "Upload video failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect()
  }
}*/