import express from "express";
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get album statistics with song counts and average duration
router.get('/album-stats', async (req, res) => {
  try {
    const stats = await prisma.album.findMany({
      select: {
        id: true,
        title: true,
        artist: true,
        genre: true,
        year: true,
        _count: {
          select: {
            songs: true
          }
        },
        songs: {
          select: {
            duration: true
          }
        }
      },
      orderBy: {
        year: 'desc'
      },
      take: 100
    });

    // Calculate average duration for each album
    const statsWithAvgDuration = stats.map(album => {
      const totalSeconds = album.songs.reduce((acc, song) => {
        const [minutes, seconds] = song.duration.split(':').map(Number);
        return acc + (minutes * 60 + seconds);
      }, 0);
      
      const avgSeconds = totalSeconds / album.songs.length;
      const avgMinutes = Math.floor(avgSeconds / 60);
      const avgRemainingSeconds = Math.floor(avgSeconds % 60);
      
      return {
        ...album,
        averageDuration: `${avgMinutes}:${avgRemainingSeconds.toString().padStart(2, '0')}`,
        songCount: album._count.songs
      };
    });

    res.json(statsWithAvgDuration);
  } catch (error) {
    console.error('Error fetching album statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;