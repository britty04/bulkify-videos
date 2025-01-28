import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { Card } from "./ui/card";

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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Handle text drop
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
      return;
    }

    // Handle file drop
    const files = Array.from(e.dataTransfer.files);
    const textFiles = files.filter(file => file.type === "text/plain");
    
    if (textFiles.length > 0) {
      try {
        const fileContent = await textFiles[0].text();
        const urls = fileContent.split("\n").filter(Boolean);
        if (urls.length > maxVideos) {
          toast.error(`You can only add ${maxVideos} more videos`);
          return;
        }
        onSubmit(urls);
      } catch (error) {
        toast.error("Error reading file");
      }
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      try {
        const fileContent = await files[0].text();
        const urls = fileContent.split("\n").filter(Boolean);
        if (urls.length > maxVideos) {
          toast.error(`You can only add ${maxVideos} more videos`);
          return;
        }
        onSubmit(urls);
      } catch (error) {
        toast.error("Error reading file");
      }
    }
  };

  return (
    <Card className="p-6 bg-secondary/5 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <textarea
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            placeholder={`Enter YouTube URLs (one per line, max ${maxVideos} more) or drag and drop links/text file here`}
            className={`w-full h-32 px-4 py-2 text-gray-200 bg-secondary/20 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
              isDragging
                ? "border-primary border-dashed border-2"
                : "border-gray-700"
            }`}
          />
          <div className="text-sm text-gray-400">
            Supported formats: Individual video URLs, Playlist URLs, or .txt file with URLs
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={!url}
            className="flex-1 bg-primary hover:bg-primary-hover text-white flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Videos
          </Button>
          <div className="relative">
            <input
              type="file"
              accept=".txt"
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
            />
            <Button
              type="button"
              onClick={() => document.getElementById("file-input")?.click()}
              variant="outline"
              className="border-gray-700 hover:bg-secondary/20"
            >
              <Upload className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default VideoInput;