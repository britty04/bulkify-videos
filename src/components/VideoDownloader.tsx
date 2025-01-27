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
  format: string;
  isMP3: boolean;
  progress: number;
  estimatedTime?: string;
  fileSize?: string;
  audioBitrate?: string;
}

const VideoDownloader = () => {
  const [videos, setVideos] = useState<VideoInfo[]>([]);

  const handleUrlsSubmit = (urls: string[]) => {
    const newVideos = urls.map((url) => ({
      id: Math.random().toString(36).substr(2, 9),
      url,
      quality: "Auto",
      format: "MP4",
      isMP3: false,
      progress: 0,
      audioBitrate: "192kbps",
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

  const handleFormatChange = (id: string, format: string) => {
    setVideos(
      videos.map((video) =>
        video.id === id ? { ...video, format } : video
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

  const handleAudioBitrateChange = (id: string, bitrate: string) => {
    setVideos(
      videos.map((video) =>
        video.id === id ? { ...video, audioBitrate: bitrate } : video
      )
    );
  };

  const handleDownload = () => {
    if (videos.length === 0) {
      toast.error("Please add at least one video URL");
      return;
    }

    // Simulate download progress with estimated time and file size
    videos.forEach((video) => {
      let progress = 0;
      const totalSize = Math.floor(Math.random() * 500) + 100; // Random file size between 100-600MB
      const interval = setInterval(() => {
        progress += 5;
        const remainingTime = Math.ceil((100 - progress) / 5) * 2; // Rough estimation
        setVideos((prev) =>
          prev.map((v) =>
            v.id === video.id
              ? {
                  ...v,
                  progress,
                  estimatedTime: `${remainingTime} seconds`,
                  fileSize: `${totalSize}MB`,
                }
              : v
          )
        );
        if (progress >= 100) {
          clearInterval(interval);
          toast.success(`Download complete: ${video.url}`);
        }
      }, 1000);
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
            onFormatChange={handleFormatChange}
            onMP3Toggle={handleMP3Toggle}
            onAudioBitrateChange={handleAudioBitrateChange}
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