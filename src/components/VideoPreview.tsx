import { Card } from "./ui/card";
import { Select } from "./ui/select";
import { Switch } from "./ui/switch";
import { Progress } from "./ui/progress";

interface VideoPreviewProps {
  video: {
    id: string;
    url: string;
    quality: string;
    isMP3: boolean;
    progress: number;
  };
  onQualityChange: (id: string, quality: string) => void;
  onMP3Toggle: (id: string) => void;
}

const VideoPreview = ({
  video,
  onQualityChange,
  onMP3Toggle,
}: VideoPreviewProps) => {
  const qualities = ["4K", "1440p", "1080p", "720p", "480p", "360p"];

  return (
    <Card className="p-4 bg-secondary text-secondary-foreground">
      <div className="space-y-4">
        <div className="aspect-video bg-gray-800 rounded-lg">
          {/* Video thumbnail would go here */}
        </div>
        
        <div className="truncate text-sm" title={video.url}>
          {video.url}
        </div>

        <div className="flex items-center justify-between">
          <select
            value={video.quality}
            onChange={(e) => onQualityChange(video.id, e.target.value)}
            className="bg-muted text-white px-3 py-1 rounded-md"
            disabled={video.isMP3}
          >
            {qualities.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <span className="text-sm">MP3</span>
            <Switch
              checked={video.isMP3}
              onCheckedChange={() => onMP3Toggle(video.id)}
            />
          </div>
        </div>

        {video.progress > 0 && (
          <Progress value={video.progress} className="h-2" />
        )}
      </div>
    </Card>
  );
};

export default VideoPreview;