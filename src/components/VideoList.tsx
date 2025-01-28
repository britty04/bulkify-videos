import { motion } from "framer-motion";
import VideoPreview from "./VideoPreview";
import { VideoInfo } from "../types/video";

interface VideoListProps {
  videos: VideoInfo[];
  onQualityChange: (id: string, quality: string) => void;
  onFormatChange: (id: string, format: string) => void;
  onMP3Toggle: (id: string) => void;
  onAudioBitrateChange: (id: string, bitrate: string) => void;
  onFileNameChange: (id: string, fileName: string) => void;
}

const VideoList = ({
  videos,
  onQualityChange,
  onFormatChange,
  onMP3Toggle,
  onAudioBitrateChange,
  onFileNameChange,
}: VideoListProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <VideoPreview
          key={video.id}
          video={video}
          onQualityChange={onQualityChange}
          onFormatChange={onFormatChange}
          onMP3Toggle={onMP3Toggle}
          onAudioBitrateChange={onAudioBitrateChange}
          onFileNameChange={onFileNameChange}
        />
      ))}
    </div>
  );
};

export default VideoList;