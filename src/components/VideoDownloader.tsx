import { useState, useEffect } from "react";
import { toast } from "sonner";
import VideoInput from "./VideoInput";
import VideoPreview from "./VideoPreview";
import { Download, History, Clipboard } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

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
  fileName?: string;
}

interface DownloadHistory {
  timestamp: number;
  video: VideoInfo;
}

const VideoDownloader = () => {
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [history, setHistory] = useState<DownloadHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [clipboardEnabled, setClipboardEnabled] = useState(false);

  useEffect(() => {
    // Load download history from localStorage
    const savedHistory = localStorage.getItem("downloadHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    // Setup clipboard monitoring if enabled
    if (clipboardEnabled && navigator.clipboard) {
      const checkClipboard = async () => {
        try {
          const text = await navigator.clipboard.readText();
          if (text.includes("youtube.com/watch?v=") || text.includes("youtu.be/")) {
            handleUrlsSubmit([text]);
            toast.success("YouTube URL detected and added!");
          }
        } catch (err) {
          console.log("Clipboard access denied");
        }
      };

      const interval = setInterval(checkClipboard, 2000);
      return () => clearInterval(interval);
    }
  }, [clipboardEnabled]);

  const handleUrlsSubmit = (urls: string[]) => {
    const newVideos = urls.map((url) => ({
      id: Math.random().toString(36).substr(2, 9),
      url,
      quality: "Auto",
      format: "MP4",
      isMP3: false,
      progress: 0,
      audioBitrate: "192kbps",
      fileName: url.split("v=")[1] || url, // Basic extraction of video ID as filename
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

  const handleFileNameChange = (id: string, fileName: string) => {
    setVideos(
      videos.map((video) =>
        video.id === id ? { ...video, fileName } : video
      )
    );
  };

  const saveToHistory = (completedVideos: VideoInfo[]) => {
    const newHistory = [
      ...completedVideos.map(video => ({
        timestamp: Date.now(),
        video,
      })),
      ...history,
    ].slice(0, 50); // Keep only last 50 downloads
    
    setHistory(newHistory);
    localStorage.setItem("downloadHistory", JSON.stringify(newHistory));
  };

  const simulateFileDownload = async (video: VideoInfo) => {
    // Simulated file sizes based on quality
    const qualitySizes = {
      "4K": 2048,
      "1440p": 1024,
      "1080p": 512,
      "720p": 256,
      "480p": 128,
      "360p": 64,
      "Auto": 256
    };

    const format = video.isMP3 ? "mp3" : video.format.toLowerCase();
    const quality = video.quality as keyof typeof qualitySizes;
    const fileSize = qualitySizes[quality];
    
    // Create a blob with actual size
    const response = await fetch(video.url);
    const blob = await response.blob();
    const resizedBlob = new Blob([blob], { type: `video/${format}` });
    
    // Create download link
    const url = window.URL.createObjectURL(resizedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${video.fileName || 'video'}.${format}`;
    
    // For mobile devices
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    if (videos.length === 0) {
      toast.error("Please add at least one video URL");
      return;
    }

    for (const video of videos) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setVideos((prev) =>
          prev.map((v) =>
            v.id === video.id
              ? {
                  ...v,
                  progress,
                  estimatedTime: `${Math.ceil((100 - progress) / 5)} seconds`,
                }
              : v
          )
        );
        
        if (progress >= 100) {
          clearInterval(interval);
          simulateFileDownload(video);
          toast.success(`Download complete: ${video.fileName || video.url}`);
        }
      }, 1000);
    }

    saveToHistory(videos);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <VideoInput onSubmit={handleUrlsSubmit} maxVideos={10 - videos.length} />
        
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setClipboardEnabled(!clipboardEnabled)}
            className="bg-secondary/10 hover:bg-secondary/20 text-white border-gray-600"
          >
            <Clipboard className="w-5 h-5 mr-2" />
            {clipboardEnabled ? 'Disable' : 'Enable'} Clipboard Monitor
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            className="bg-secondary/10 hover:bg-secondary/20 text-white border-gray-600"
          >
            <History className="w-5 h-5 mr-2" />
            Download History
          </Button>
        </div>
      </div>

      {showHistory && history.length > 0 && (
        <Card className="p-4 bg-secondary/10 backdrop-blur-sm border-gray-600">
          <h3 className="text-lg font-semibold mb-4 text-white">Recent Downloads</h3>
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={`${item.timestamp}-${item.video.id}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/20"
              >
                <div className="flex-1 truncate mr-4">
                  <div className="text-sm font-medium text-white">
                    {item.video.fileName || item.video.url}
                  </div>
                  <div className="text-xs text-gray-300">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => redownloadFromHistory(item)}
                  className="hover:bg-primary/20 text-white"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <VideoPreview
            key={video.id}
            video={video}
            onQualityChange={handleQualityChange}
            onFormatChange={handleFormatChange}
            onMP3Toggle={handleMP3Toggle}
            onAudioBitrateChange={handleAudioBitrateChange}
            onFileNameChange={handleFileNameChange}
          />
        ))}
      </div>

      {videos.length > 0 && (
        <div className="flex justify-center">
          <Button
            onClick={handleDownload}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg flex items-center gap-2 text-lg font-semibold"
          >
            <Download className="w-6 h-6" />
            Start Download
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoDownloader;
