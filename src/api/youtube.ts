import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const fetchVideoMetadata = async (url: string) => {
  try {
    const response = await axios.get(`${API_URL}/video-info`, {
      params: { url }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching video metadata:", error);
    throw error;
  }
};

export const downloadVideo = async (
  url: string,
  format: string,
  quality: string,
  isMP3: boolean,
  fileName: string
) => {
  try {
    const response = await axios.get(`${API_URL}/download`, {
      params: { url, format, quality, isMP3, fileName },
      responseType: "blob"
    });
    
    const blob = new Blob([response.data], {
      type: isMP3 ? "audio/mp3" : `video/${format.toLowerCase()}`
    });
    
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${fileName}.${isMP3 ? "mp3" : format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
    
    return true;
  } catch (error) {
    console.error("Error downloading video:", error);
    throw error;
  }
};