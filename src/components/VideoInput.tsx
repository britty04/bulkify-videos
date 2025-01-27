import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";

interface VideoInputProps {
  onSubmit: (urls: string[]) => void;
  maxVideos: number;
}

const VideoInput = ({ onSubmit, maxVideos }: VideoInputProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    const urls = url.split("\n").filter(Boolean);
    if (urls.length > maxVideos) {
      toast.error(`You can only add ${maxVideos} more videos`);
      return;
    }

    onSubmit(urls);
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <textarea
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={`Enter YouTube URLs (one per line, max ${maxVideos} more)`}
          className="w-full h-32 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      <Button
        type="submit"
        disabled={!url}
        className="w-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Videos
      </Button>
    </form>
  );
};

export default VideoInput;