import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST() {
  const timestamp = Math.round(Date.now() / 1000);

  // include ALL params you send from client
  const paramsToSign = `folder=videos&timestamp=${timestamp}`;

  //Every param sent to Cloudinary must be in the signature string
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + process.env.CLOUDINARY_API_SECRET)
    .digest("hex");

  return NextResponse.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
}