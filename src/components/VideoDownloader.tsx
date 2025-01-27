import { useState } from "react";
import { toast } from "sonner";
import VideoInput from "./VideoInput";
import VideoPreview from "./VideoPreview";
import { Download } from "lucide-react";
import { Button } from "./ui/button";

interface VideoInfo {
  id: string;
  url: string;
  quality: string;
  isMP3: boolean;
  progress: number;
}

const VideoDownloader = () => {
  const [videos, setVideos] = useState<VideoInfo[]>([]);

  const handleUrlsSubmit = (urls: string[]) => {
    const newVideos = urls.map((url) => ({
      id: Math.random().toString(36).substr(2, 9),
      url,
      quality: "720p",
      isMP3: false,
      progress: 0,
    }));
    setVideos([...videos, ...newVideos]);
  };

  const handleQualityChange = (id: string, quality: string) => {
    setVideos(
      videos.map((video) =>
        video.id === id ? { ...video, quality } : video
      )
    );
  };

  const handleMP3Toggle = (id: string) => {
    setVideos(
      videos.map((video) =>
        video.id === id ? { ...video, isMP3: !video.isMP3 } : video
      )
    );
  };

  const handleDownload = () => {
    if (videos.length === 0) {
      toast.error("Please add at least one video URL");
      return;
    }

    // Simulate download progress
    videos.forEach((video) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setVideos((prev) =>
          prev.map((v) =>
            v.id === video.id ? { ...v, progress } : v
          )
        );
        if (progress >= 100) {
          clearInterval(interval);
          toast.success(`Download complete: ${video.url}`);
        }
      }, 500);
    });
  };

  return (
    <div className="space-y-6">
      <VideoInput onSubmit={handleUrlsSubmit} maxVideos={10 - videos.length} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <VideoPreview
            key={video.id}
            video={video}
            onQualityChange={handleQualityChange}
            onMP3Toggle={handleMP3Toggle}
          />
        ))}
      </div>

      {videos.length > 0 && (
        <div className="flex justify-center">
          <Button
            onClick={handleDownload}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Start Download
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoDownloader;