'use client'
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import VideoCard from '@/components/VideoCard'
import { Video } from '@/types'
import { toast } from 'sonner'
import { Loader2Icon } from "lucide-react";

function Home() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos")
     // console.log(response);
      
      if (Array.isArray(response.data)) {
        setVideos(response.data)
      } else {
        throw new Error("Unexpected response format")
      }
    } catch (error: any) {
      console.error("An  error occured while fetching the videos: ", error);
      setError("Failed to fetch videos")
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  /*const handleDownload = useCallback((url: string, title: string) => {
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title}.mp4`);
      link.setAttribute("target", "_blank");

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
  },[])*/

  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.mp4`;
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);
  
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div
        className="
          flex flex-col items-center gap-4
          bg-base-100/70 backdrop-blur-xl
          border border-white/10
          rounded-2xl
          px-10 py-8
          shadow-2xl
        "
      >
        <Loader2Icon className="w-10 h-10 text-primary animate-spin" />
        <p className="text-base-content/70 font-medium">
          Loading, please wait…
        </p>
      </div>
    </div>
  );
}

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Videos</h1>
      {
        videos.length === 0 ? (
        <div className='text-center text-lg text-gray-500'>
          No videos available
        </div>
        ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {
                videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onDownload={handleDownload}
                  />
                ))
              }
            </div>
        )
      }
    </div>
  )
}

export default Home
