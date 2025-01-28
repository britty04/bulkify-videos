export interface VideoInfo {
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

export interface DownloadHistory {
  timestamp: number;
  video: VideoInfo;
}

export interface VideoMetadata {
  title: string;
  duration: string;
  thumbnail: string;
  formats: {
    quality: string;
    format: string;
    fileSize: number;
  }[];
}