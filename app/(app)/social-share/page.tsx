"use client"
import React, { useState, useEffect, useRef } from 'react';
import { CldImage } from "next-cloudinary";

const socialFormats = {
  "Instagram Square (1:1)": {
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
  },
  "Instagram Portrait (4:5)": {
    width: 1080,
    height: 1350,
    aspectRatio: "4:5",
  },
  "Twitter Post (16:9)": {
    width: 1200,
    height: 675,
    aspectRatio: "16:9",
  },
  "Twitter Header (3:1)": {
    width: 1500,
    height: 500,
    aspectRatio: "3:1",
  },
  "Facebook Cover (205:78)": {
    width: 820,
    height: 312,
    aspectRatio: "205:78",
  },

  // LinkedIn
  "LinkedIn Profile Photo (1:1)": {
    width: 800,
    height: 800,
    aspectRatio: "1:1",
  },
  "LinkedIn Cover Photo (4:1)": {
    width: 1584,
    height: 396,
    aspectRatio: "4:1",
  },
  "LinkedIn Post (1.91:1)": {
    width: 1200,
    height: 627,
    aspectRatio: "1.91:1",
  },
} as const;

type SocialFormat = keyof typeof socialFormats


export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectecFormat] = useState<SocialFormat>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true)
    }
  }, [selectedFormat, uploadedImage])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true)

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      setUploadedImage(data.publicId);

    } catch (error) {
      console.error(error);
      alert("Failed to upload image")
    } finally {
      setIsUploading(false);
    }
  }

  const handleDownload = async () => {
    //  Make sure the image exists
    if (!imageRef.current) return;

    //  Get the image URL
    const imageUrl = imageRef.current.src;

    //  Fetch the image data, or Downloads the image from the URL.
    const response = await fetch(imageUrl);

    //  Convert response into a file-like object, or Turns the image into raw binary data (like a file).
    const blob = await response.blob();

    //  Create a temporary URL for the file, or Browser creates a temporary file URL.
    const downloadUrl = URL.createObjectURL(blob);

    //  Create a hidden <a> tag, or Browser downloads files only via links.
    const link = document.createElement("a");
    link.href = downloadUrl;

    //  Set the file name, or This is the name of the downloaded file.
    link.download = `${selectedFormat.replace(/\s+/g, "-").toLowerCase()}.png`;

    //  Trigger download
    document.body.appendChild(link);
    link.click();

    //  Clean up, or Frees memory (important for performance).
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };


  /*
  const handleDownload = () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat
          .replace(/\s+/g, "-")
          .toLowerCase()}.png`;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };*/

return (
  <div
    className="
    min-h-screen
    bg-linear-to-br from-base-300 via-base-200 to-base-100
    flex items-center justify-center px-4 py-12
  "
  >
    <div className="w-full max-w-5xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Social Media Image Creator
        </h1>
        <p className="mt-3 text-base-content/60">
          Upload once, resize perfectly for every platform
        </p>
      </div>

      {/* Main Card */}
      <div
        className="
          card
          bg-base-100/70 backdrop-blur-xl
          shadow-2xl
          border border-white/10
          rounded-2xl
        "
      >
        <div className="card-body space-y-10">
          {/* Upload Section */}
          <div className="bg-base-200 rounded-xl p-6 border border-white/10">
            <h2 className="card-title mb-1">Upload Image</h2>
            <p className="text-sm text-base-content/60 mb-4">
              Supported formats: JPG, PNG, WebP
            </p>

            <input
              type="file"
              onChange={handleFileUpload}
              className="
                file-input file-input-bordered
                file-input-primary w-full
                bg-base-100
              "
            />

            {isUploading && (
              <div className="mt-4 space-y-2">
                <progress className="progress progress-primary w-full" />
                <p className="text-sm text-center text-base-content/50">
                  Uploading image…
                </p>
              </div>
            )}
          </div>

          {/* Format & Preview */}
          {uploadedImage && (
            <>
              <div className="divider divider-neutral" />

              {/* Format Selector */}
              <div className="grid md:grid-cols-2 gap-6 items-end">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">
                      Select Social Media Format
                    </span>
                  </label>

                  <select
                    className="
                      select select-bordered w-full
                      bg-base-100
                    "
                    value={selectedFormat}
                    onChange={(e) =>
                      setSelectecFormat(e.target.value as SocialFormat)
                    }
                  >
                    {Object.keys(socialFormats).map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="
                    btn btn-primary btn-wide
                    shadow-lg
                    hover:shadow-primary/40
                    transition-all duration-300
                    md:justify-self-end
                  "
                  onClick={handleDownload}
                  disabled={isTransforming}
                >
                  {isTransforming ? (
                    <>
                      <span className="loading loading-spinner" />
                      Processing…
                    </>
                  ) : (
                    <>Download for {selectedFormat}</>
                  )}
                </button>
              </div>

              {/* Preview */}
              <div className="relative mt-8">
                <h3 className="font-semibold mb-3">Live Preview</h3>

                <div
                  className="
                    relative flex justify-center
                    bg-black rounded-xl p-5
                    shadow-inner overflow-hidden
                  "
                >
                  {isTransforming && (
                    <div
                      className="
                        absolute inset-0
                        bg-black/60 backdrop-blur
                        flex items-center justify-center
                        z-10 rounded-xl
                      "
                    >
                      <span className="loading loading-spinner loading-lg text-primary" />
                    </div>
                  )}

                  <div className="rounded-lg overflow-hidden shadow-2xl">
                    <CldImage
                      width={socialFormats[selectedFormat].width}
                      height={socialFormats[selectedFormat].height}
                      src={uploadedImage}
                      sizes="100vw"
                      alt="transformed image"
                      crop="fill"
                      aspectRatio={socialFormats[selectedFormat].aspectRatio}
                      gravity="auto"
                      ref={imageRef}
                      onLoad={() => setIsTransforming(false)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);
}


{
/*<div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-5xl">
      {/* Header *//*
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Social Media Image Creator
        </h1>
        <p className="mt-3 text-base-content/70">
          Upload once, resize perfectly for every platform
        </p>
      </div>

      {/* Main Card *//*
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body space-y-8">
          {/* Upload Section *//*
          <div>
            <h2 className="card-title mb-2">Upload Image</h2>
            <p className="text-sm text-base-content/60 mb-4">
              Supported formats: JPG, PNG, WebP
            </p>

            <input
              type="file"
              onChange={handleFileUpload}
              className="file-input file-input-bordered file-input-primary w-full"
            />

            {isUploading && (
              <div className="mt-4 space-y-2">
                <progress className="progress progress-primary w-full" />
                <p className="text-sm text-center text-base-content/60">
                  Uploading image…
                </p>
              </div>
            )}
          </div>

          {/* Format & Preview *//*
          {uploadedImage && (
            <>
              <div className="divider" />

              {/* Format Selector *//*
              <div className="grid md:grid-cols-2 gap-6 items-end">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">
                      Select Social Media Format
                    </span>
                  </label>

                  <select
                    className="select select-bordered select-primary w-full"
                    value={selectedFormat}
                    onChange={(e) =>
                      setSelectecFormat(e.target.value as SocialFormat)
                    }
                  >
                    {Object.keys(socialFormats).map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="btn btn-primary btn-wide md:justify-self-end"
                  onClick={handleDownload}
                  disabled={isTransforming}
                >
                  {isTransforming ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Processing…
                    </>
                  ) : (
                    <>Download for {selectedFormat}</>
                  )}
                </button>
              </div>

              {/* Preview *//*
              <div className="relative mt-6">
                <h3 className="font-semibold mb-3">Live Preview</h3>

                <div className="relative flex justify-center bg-base-200 rounded-xl p-6 shadow-inner overflow-hidden">
                  {isTransforming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-100/70 backdrop-blur z-10">
                      <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                  )}

                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <CldImage
                      width={socialFormats[selectedFormat].width}
                      height={socialFormats[selectedFormat].height}
                      src={uploadedImage}
                      sizes="100vw"
                      alt="transformed image"
                      crop="fill"
                      aspectRatio={socialFormats[selectedFormat].aspectRatio}
                      gravity="auto"
                      ref={imageRef}
                      onLoad={() => setIsTransforming(false)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  </div> */


////////////////////////////////////////////////////////////////////////////////////////////////////////
  

/* <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Social Media Image Creator
      </h1>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">Upload an Image</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Choose an image file</span>
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="file-input file-input-bordered file-input-primary w-full"
            />
          </div>

          {isUploading && (
            <div className="mt-4">
              <progress className="progress progress-primary w-full"></progress>
            </div>
          )}

          {uploadedImage && (
            <div className="mt-6">
              <h2>Select Social Media Format</h2>
              <div className="form-control">
                <select
                  className="select select-bordered w-full"
                  value={selectedFormat}
                  onChange={(e) =>
                    setSelectecFormat(e.target.value as SocialFormat)
                  }
                >
                  {Object.keys(socialFormats).map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 relative">
                <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                <div className="flex justify-center">
                  {isTransforming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
                      <span className="loading loading-spinner loading-lg"></span>
                    </div>
                  )}
                  <CldImage
                    width={socialFormats[selectedFormat].width}
                    height={socialFormats[selectedFormat].height}
                    src={uploadedImage}
                    sizes="100vw"
                    alt="transformed image"
                    crop="fill"
                    aspectRatio={socialFormats[selectedFormat].aspectRatio}
                    gravity='auto'
                    ref={imageRef}
                    onLoad={() => setIsTransforming(false)}
                  />
                </div>
              </div>

              <div className='card-actions justify-end mt-6'>
                <button className='btn btn-primary' onClick={handleDownload}>
                  Download for {selectedFormat}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>*/
}