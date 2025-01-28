import { useState, useEffect } from "react";
import { toast } from "sonner";
import VideoInput from "./VideoInput";
import VideoList from "./VideoList";
import DownloadHistoryComponent from "./DownloadHistory";
import { Download, History, Clipboard } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { VideoInfo, DownloadHistory } from "../types/video";
import { downloadVideo } from "../api/youtube";

const VideoDownloader = () => {
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [history, setHistory] = useState<DownloadHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [clipboardEnabled, setClipboardEnabled] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem("downloadHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

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
      fileName: url.split("v=")[1] || url,
    }));
    setVideos([...videos, ...newVideos]);
  };

  const handleQualityChange = (id: string, quality: string) => {
    setVideos(videos.map((video) => (video.id === id ? { ...video, quality } : video)));
  };

  const handleFormatChange = (id: string, format: string) => {
    setVideos(videos.map((video) => (video.id === id ? { ...video, format } : video)));
  };

  const handleMP3Toggle = (id: string) => {
    setVideos(videos.map((video) => (video.id === id ? { ...video, isMP3: !video.isMP3 } : video)));
  };

  const handleAudioBitrateChange = (id: string, bitrate: string) => {
    setVideos(videos.map((video) => (video.id === id ? { ...video, audioBitrate: bitrate } : video)));
  };

  const handleFileNameChange = (id: string, fileName: string) => {
    setVideos(videos.map((video) => (video.id === id ? { ...video, fileName } : video)));
  };

  const saveToHistory = (completedVideos: VideoInfo[]) => {
    const newHistory = [
      ...completedVideos.map(video => ({
        timestamp: Date.now(),
        video,
      })),
      ...history,
    ].slice(0, 100);
    
    setHistory(newHistory);
    localStorage.setItem("downloadHistory", JSON.stringify(newHistory));
  };

  const redownloadFromHistory = async (historyItem: DownloadHistory) => {
    const video = historyItem.video;
    setVideos(prev => [...prev, { ...video, progress: 0, id: Math.random().toString(36).substr(2, 9) }]);
    toast.success("Video added to download queue");
  };

  const handleDownload = async () => {
    if (videos.length === 0) {
      toast.error("Please add at least one video URL");
      return;
    }

    for (const video of videos) {
      try {
        let progress = 0;
        const progressInterval = setInterval(() => {
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
            clearInterval(progressInterval);
          }
        }, 1000);

        await downloadVideo(
          video.url,
          video.format,
          video.quality,
          video.isMP3,
          video.fileName || "video"
        );

        toast.success(`Download complete: ${video.fileName || video.url}`);
      } catch (error) {
        console.error("Download error:", error);
        toast.error(`Download failed for ${video.fileName || video.url}`);
      }
    }

    saveToHistory(videos);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          TubeHarbor Pro
        </h1>
        <p className="text-gray-400 text-lg">
          Download unlimited YouTube videos in any quality, format, and resolution
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <VideoInput onSubmit={handleUrlsSubmit} maxVideos={1000} />
        
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setClipboardEnabled(!clipboardEnabled)}
            className="bg-secondary/10 hover:bg-secondary/20 text-white border-gray-600 backdrop-blur-sm"
          >
            <Clipboard className="w-5 h-5 mr-2" />
            {clipboardEnabled ? 'Disable' : 'Enable'} Clipboard Monitor
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            className="bg-secondary/10 hover:bg-secondary/20 text-white border-gray-600 backdrop-blur-sm"
          >
            <History className="w-5 h-5 mr-2" />
            Download History
          </Button>
        </div>
      </div>

      {showHistory && history.length > 0 && (
        <DownloadHistoryComponent history={history} onRedownload={redownloadFromHistory} />
      )}

      <VideoList
        videos={videos}
        onQualityChange={handleQualityChange}
        onFormatChange={handleFormatChange}
        onMP3Toggle={handleMP3Toggle}
        onAudioBitrateChange={handleAudioBitrateChange}
        onFileNameChange={handleFileNameChange}
      />

      {videos.length > 0 && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={handleDownload}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg flex items-center gap-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Download className="w-6 h-6" />
            Start Download
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default VideoDownloader;