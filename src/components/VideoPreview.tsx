import { Card } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Progress } from "./ui/progress";
import { Info, Download, Edit2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";

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
    fileName?: string;
  };
  onQualityChange: (id: string, quality: string) => void;
  onFormatChange: (id: string, format: string) => void;
  onMP3Toggle: (id: string) => void;
  onAudioBitrateChange: (id: string, bitrate: string) => void;
  onFileNameChange?: (id: string, name: string) => void;
}

const VideoPreview = ({
  video,
  onQualityChange,
  onFormatChange,
  onMP3Toggle,
  onAudioBitrateChange,
  onFileNameChange,
}: VideoPreviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fileName, setFileName] = useState(video.fileName || "");

  const handleFileNameSave = () => {
    if (onFileNameChange) {
      onFileNameChange(video.id, fileName);
      setIsEditing(false);
      toast.success("Filename updated");
    }
  };

  return (
    <Card className="p-4 bg-secondary/10 backdrop-blur-sm border-gray-600">
      <div className="space-y-4">
        <div className="aspect-video bg-gray-800 rounded-lg relative overflow-hidden">
          {video.progress > 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-full px-4 space-y-2">
                <Progress value={video.progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-300">
                  <span>{video.progress}%</span>
                  {video.estimatedTime && (
                    <span>Est. time: {video.estimatedTime}</span>
                  )}
                </div>
              </div>
            </div>
          )}
          {video.fileSize && (
            <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
              {video.fileSize}
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex-1 flex gap-2">
                <Input
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="flex-1 h-8 bg-secondary/20 border-gray-600 text-white"
                  placeholder="Enter filename"
                />
                <Button
                  size="sm"
                  onClick={handleFileNameSave}
                  className="h-8 px-3 bg-primary hover:bg-primary-hover text-white"
                >
                  Save
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 truncate text-sm text-white" title={video.url}>
                  {fileName || video.url}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0 text-white hover:bg-secondary/20"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <Select
              value={video.quality}
              onValueChange={(value) => onQualityChange(video.id, value)}
              disabled={video.isMP3}
            >
              <SelectTrigger className="w-full sm:w-[140px] bg-secondary/20 border-gray-600 text-white">
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {["Auto", "4K", "1440p", "1080p", "720p", "480p", "360p"].map((q) => (
                  <SelectItem key={q} value={q} className="text-white hover:bg-secondary/20">
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
                <SelectTrigger className="w-full sm:w-[100px] bg-secondary/20 border-gray-600 text-white">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {["MP4", "AVI", "WEBM"].map((f) => (
                    <SelectItem key={f} value={f} className="text-white hover:bg-secondary/20">
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white">MP3</span>
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
                <SelectTrigger className="w-[120px] bg-secondary/20 border-gray-600 text-white">
                  <SelectValue placeholder="Bitrate" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {["128kbps", "192kbps", "320kbps"].map((b) => (
                    <SelectItem key={b} value={b} className="text-white hover:bg-secondary/20">
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VideoPreview;
