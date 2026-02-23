'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { uploadVideoToCloudinary } from '@/lib/cloudinary';

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const router = useRouter();
  //max file size of 70mb

  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || isUploading) return;

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!file.type.startsWith("video/")) {
      toast.error("Please upload a valid video file");
      return;
    }

   if (file.size > MAX_FILE_SIZE) {
     toast.error(`File size must be less than ${Math.round( MAX_FILE_SIZE / 1024 / 1024 )}MB`);
     return;
   }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      //  Upload to Cloudinary
      const upload = await uploadVideoToCloudinary(file, setUploadProgress);
      console.log("Cloudinary upload: ",upload);
      
      if (!upload?.public_id) {
        throw new Error("Cloudinary upload failed");
      }

      //  Ensure progress finishes cleanly
      setUploadProgress(100);

      // Ask backend for COMPRESSED size
      const sizeRes = await axios.post("/api/video-size", {
        publicId: upload.public_id,
      });

      const { originalBytes, compressedBytes } = sizeRes.data;

      // Save metadata to DB
      await axios.post("/api/video-upload", {
        title: title.trim(),
        description: description.trim(),
        publicId: upload.public_id,
        duration: upload.duration ?? 0,
        originalSize: originalBytes,
        compressedSize: compressedBytes,
      });

      toast.success("Video uploaded successfully 🎉");

      // Reset
      setFile(null);
      setTitle("");
      setDescription("");
      setUploadProgress(0);
    } catch (error: any) {
      console.error(" Video upload error:", error);

      const message = error?.response?.data?.error || error?.message || "Something went wrong while uploading the video.";
      toast.error(message || "video upload error");
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="w-full">
      <div className="w-full ">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Upload Video
          </h1>
          <p className="mt-2 text-base-content/60">
            Add details and upload your video securely
          </p>
        </div>

        {/* Card */}
        <div
          className="
        card bg-base-100/70 backdrop-blur-xl
        shadow-2xl border border-white/10
        rounded-2xl
      "
        >
          <div className="card-body space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Title</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  className="input input-bordered w-full bg-base-100"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Description</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description (optional)"
                  className="textarea textarea-bordered w-full bg-base-100 min-h-[100px]"
                />
              </div>

              {/* File Upload */}
              <div className="bg-base-200 rounded-xl p-5 border border-white/10">
                <label className="label">
                  <span className="label-text font-semibold">Video File</span>
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="file-input file-input-bordered w-full bg-base-100"
                  required
                />
                <p className="text-sm text-base-content/50 mt-2">
                  Supported format: MP4
                </p>
              </div>

              {isUploading && (
                <div className="mt-4 space-y-2">
                  <progress
                    className="progress progress-primary w-full"
                    value={uploadProgress}
                    max={100}
                  />
                  <p className="text-sm text-center text-base-content/60">
                    Uploading… {uploadProgress}%
                  </p>
                </div>
              )}

              {/* Action */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="
                  btn btn-primary btn-wide
                  shadow-lg
                  hover:shadow-primary/40
                  transition-all duration-300
                "
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <span className="loading loading-spinner" />
                      Uploading…
                    </>
                  ) : (
                    "Upload Video"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoUpload


/*return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='textarea textarea-bordered w-full'
          />
        </div>
        <div>
          <label className='label'>
            <span className='label-text'>Video File</span>
          </label>
          <input
            type='file'
            accept='video/*'
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className='file-input file-input-bordered w-full'
            required
          />
        </div>

        <button
          type='submit'
          className='btn btn-primary'
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." :"Upload Video"}
        </button>
      </form>
    </div>
  ); */



 

  /*
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (isUploading || !file) return;

  //  Basic validations
  if (!title.trim()) {
    toast.error("Title is required");
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    toast.error(
      `File size must be less than ${Math.round(
        MAX_FILE_SIZE / 1024 / 1024,
      )}MB`,
    );
    return;
  }

  if (!file.type.startsWith("video/")) {
    toast.error("Please upload a valid video file");
    return;
  }

  setIsUploading(true);
  setUploadProgress(0);

  try {
    //  Upload directly to Cloudinary
    const result = await uploadVideoToCloudinary(file, setUploadProgress);

    if (!result?.public_id) {
      throw new Error("Cloudinary upload failed");
    }

    //  Ensure progress finishes cleanly
    setUploadProgress(100);

    //  Save metadata to DB
    await axios.post("/api/video-upload", {
      title: title.trim(),
      description: description?.trim() || "",
      publicId: result.public_id,
      originalSize: file.size.toString(),
      compressedSize: String(result.bytes),
      duration: result.duration ?? 0,
    });

    toast.success("Video uploaded successfully 🎉");

    //  Reset form (important UX)
    setFile(null);
    setTitle("");
    setDescription("");
    setUploadProgress(0);

    //  Optional: redirect after upload
    // router.push("/home");
  } catch (error: any) {
    console.error(" Video upload error:", error);

    const message =
      error?.response?.data?.error ||
      error?.message ||
      "Something went wrong while uploading the video.";

    toast.error(message);
  } finally {
    setUploadProgress(0);
    setIsUploading(false);
  }
};*/

  /*  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isUploading || !file) return;

    if (file.size > MAX_FILE_SIZE) {
        toast.error(
          `File size must be less than ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB`,
      );
      return;
    }

    if (!file.type.startsWith("video/")) {
      toast.error("Please upload a valid video file");
      return;
    }

    setIsUploading(true)
    const formData = new FormData();
    formData.append("file", file)
    formData.append("title", title)
    formData.append("description", description)
    formData.append("originalSize", file.size.toString())

    try {
     const response = await axios.post("/api/video-upload", formData);
   
      if (response.data.success) {
        //const video = response.data.video;
        //setUploadedVideo(video); // optional
        toast.success("Video uploaded successfully");
      }
      
    } catch (error:any) {
      console.error("Error in video-upload file: ", error);
       const message =
         error?.response?.data?.error ||
         error?.message ||
        "Something went wrong. while uploading video please try again later.";
      
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  } */