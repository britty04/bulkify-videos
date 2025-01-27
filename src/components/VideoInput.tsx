import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface VideoInputProps {
  onSubmit: (urls: string[]) => void;
  maxVideos: number;
}

const VideoInput = ({ onSubmit, maxVideos }: VideoInputProps) => {
  const [url, setUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const text = e.dataTransfer.getData("text");
    if (text) {
      const urls = text.split("\n").filter(Boolean);
      if (urls.length > maxVideos) {
        toast.error(`You can only add ${maxVideos} more videos`);
        return;
      }
      setUrl(text);
      onSubmit(urls);
      setUrl("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <textarea
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          placeholder={`Enter YouTube URLs (one per line, max ${maxVideos} more) or drag and drop links here`}
          className={`w-full h-32 px-4 py-2 text-gray-900 bg-white border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
            isDragging
              ? "border-primary border-dashed border-2"
              : "border-gray-300"
          }`}
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