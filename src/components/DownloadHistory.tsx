import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Download, History, Youtube } from "lucide-react";
import { DownloadHistory } from "../types/video";

interface DownloadHistoryProps {
  history: DownloadHistory[];
  onRedownload: (historyItem: DownloadHistory) => void;
}

const DownloadHistoryComponent = ({ history, onRedownload }: DownloadHistoryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
    >
      <Card className="p-4 bg-secondary/10 backdrop-blur-sm border-gray-600">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          <History className="w-5 h-5" />
          Recent Downloads
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {history.map((item) => (
            <motion.div
              key={`${item.timestamp}-${item.video.id}`}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/20 transition-colors"
            >
              <div className="flex-1 truncate mr-4">
                <div className="text-sm font-medium text-white flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-500" />
                  {item.video.fileName || item.video.url}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(item.timestamp).toLocaleString()}
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRedownload(item)}
                className="hover:bg-primary/20 text-white"
              >
                <Download className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default DownloadHistoryComponent;