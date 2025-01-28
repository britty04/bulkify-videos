import type { NextApiRequest, NextApiResponse } from 'next';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { url, format, quality, isMP3 } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    const info = await ytdl.getInfo(url);
    
    if (isMP3 === 'true') {
      const audioStream = ytdl(url, { quality: 'highestaudio' });
      
      res.setHeader('Content-Type', 'audio/mp3');
      res.setHeader('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp3"`);
      
      ffmpeg(audioStream)
        .toFormat('mp3')
        .pipe(res as unknown as Readable);
    } else {
      const videoFormat = ytdl.chooseFormat(info.formats, {
        quality: quality === 'Auto' ? 'highest' : quality,
        filter: 'videoandaudio',
      });

      res.setHeader('Content-Type', `video/${format.toLowerCase()}`);
      res.setHeader('Content-Disposition', `attachment; filename="${info.videoDetails.title}.${format.toLowerCase()}"`);
      
      const videoStream = ytdl(url, { format: videoFormat });
      videoStream.pipe(res);
    }
  } catch (error) {
    console.error('Error downloading:', error);
    res.status(500).json({ message: 'Error downloading video' });
  }
}