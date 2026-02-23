import axios from "axios";

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  bytes: number; // original bytes (important)
  duration?: number;
  format?: string;
}

export const uploadVideoToCloudinary = async (
  file: File,
  onProgress?: (percent: number) => void,
): Promise<CloudinaryUploadResult> => {
  // Get signed params from backend
  const { data: sign } = await axios.post("/api/cloudinary-sign");

  // Prepare form data
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sign.apiKey);
  formData.append("timestamp", sign.timestamp);
  formData.append("signature", sign.signature);
  formData.append("folder", "videos");

  // Upload directly to Cloudinary
  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${sign.cloudName}/video/upload`,
    formData,
    {
     // headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (!e.total || !onProgress) return;
        const percent = Math.round((e.loaded * 100) / e.total);
        onProgress(percent);
      },
    },
  );

   return {
     ...res.data,
     public_id: res.data.public_id,
   };
};
