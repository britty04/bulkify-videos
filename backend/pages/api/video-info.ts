import type { NextApiRequest, NextApiResponse } from 'next';
import ytdl from 'ytdl-core';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    const info = await ytdl.getInfo(url);
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio');

    const metadata = {
      title: info.videoDetails.title,
      duration: info.videoDetails.lengthSeconds,
      thumbnail: info.videoDetails.thumbnails[0].url,
      formats: formats.map(format => ({
        quality: format.qualityLabel,
        format: format.container,
        fileSize: parseInt(format.contentLength, 10),
      })),
    };

    res.status(200).json(metadata);
  } catch (error) {
    console.error('Error fetching video info:', error);
    res.status(500).json({ message: 'Error fetching video information' });
  }
}