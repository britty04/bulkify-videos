import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HelpCircle } from "lucide-react";
import { Button } from "./ui/button";

const TutorialSection = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4">
          <HelpCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>How to Use the Downloader</SheetTitle>
          <SheetDescription>
            Follow these simple steps to download your videos
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">1. Add Video URLs</h3>
            <p className="text-sm text-muted-foreground">
              Type or drag-and-drop YouTube video URLs into the input field. You can add up to 10 videos at once.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">2. Select Quality</h3>
            <p className="text-sm text-muted-foreground">
              Choose your preferred video quality for each video, from standard definition up to 4K (when available).
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">3. Convert to MP3</h3>
            <p className="text-sm text-muted-foreground">
              Toggle the MP3 switch if you want to download the audio only in MP3 format.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">4. Start Download</h3>
            <p className="text-sm text-muted-foreground">
              Click the "Start Download" button and wait for your videos to complete downloading.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TutorialSection;