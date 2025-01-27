import { Card } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Progress } from "./ui/progress";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface VideoPreviewProps {
  video: {
    id: string;
    url: string;
    quality: string;
    format: string;
    isMP3: boolean;
    progress: number;
    estimatedTime?: string;
    fileSize?: string;
    audioBitrate?: string;
  };
  onQualityChange: (id: string, quality: string) => void;
  onFormatChange: (id: string, format: string) => void;
  onMP3Toggle: (id: string) => void;
  onAudioBitrateChange: (id: string, bitrate: string) => void;
}

const VideoPreview = ({
  video,
  onQualityChange,
  onFormatChange,
  onMP3Toggle,
  onAudioBitrateChange,
}: VideoPreviewProps) => {
  const qualities = ["Auto", "4K", "1440p", "1080p", "720p", "480p", "360p"];
  const formats = ["MP4", "AVI", "WEBM"];
  const audioBitrates = ["128kbps", "192kbps", "320kbps"];

  return (
    <Card className="p-4 bg-secondary text-secondary-foreground">
      <div className="space-y-4">
        <div className="aspect-video bg-gray-800 rounded-lg relative">
          {/* Video thumbnail would go here */}
          {video.fileSize && (
            <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
              {video.fileSize}
            </div>
          )}
        </div>
        
        <div className="truncate text-sm" title={video.url}>
          {video.url}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Select
              value={video.quality}
              onValueChange={(value) => onQualityChange(video.id, value)}
              disabled={video.isMP3}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent>
                {qualities.map((q) => (
                  <SelectItem key={q} value={q}>
                    {q}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {!video.isMP3 && (
              <Select
                value={video.format}
                onValueChange={(value) => onFormatChange(video.id, value)}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  {formats.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">MP3</span>
              <Switch
                checked={video.isMP3}
                onCheckedChange={() => onMP3Toggle(video.id)}
              />
            </div>

            {video.isMP3 && (
              <Select
                value={video.audioBitrate}
                onValueChange={(value) => onAudioBitrateChange(video.id, value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Bitrate" />
                </SelectTrigger>
                <SelectContent>
                  {audioBitrates.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {video.progress > 0 && (
          <div className="space-y-2">
            <Progress value={video.progress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{video.progress}%</span>
              {video.estimatedTime && (
                <span>Est. time: {video.estimatedTime}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VideoPreview;