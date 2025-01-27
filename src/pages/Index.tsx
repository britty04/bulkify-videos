import VideoDownloader from "@/components/VideoDownloader";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          YouTube Bulk Downloader
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Download up to 10 videos simultaneously in any quality, including 4K
        </p>
        <VideoDownloader />
      </div>
    </div>
  );
};

export default Index;