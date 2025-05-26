import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database population...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.song.deleteMany({});
  await prisma.image.deleteMany({});
  await prisma.album.deleteMany({});
  
  // Reset sequences if using PostgreSQL
  await prisma.$executeRaw`TRUNCATE TABLE "Album" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Song" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Image" RESTART IDENTITY CASCADE`;

  console.log('Creating new data...');

  // Create albums in batches of 100
  const batchSize = 100;
  for (let i = 0; i < 1000; i += batchSize) {
    const albums: { title: string; artist: string; genre: string; year: number; price: number; format: string; }[] = [];
    for (let j = 0; j < batchSize && i + j < 1000; j++) {
      albums.push({
        title: faker.music.songName(),
        artist: faker.person.fullName(),
        genre: faker.helpers.arrayElement(['Rock', 'Pop', 'Jazz', 'Trap', 'Hip Hop', 'EDM']),
        year: faker.number.int({ min: 1950, max: 2024 }),
        price: parseFloat(faker.commerce.price({ min: 10, max: 100 })),
        format: faker.helpers.arrayElement(['CD', 'Vinyl', 'Digital']),
      });
    }

    // Create albums in batch
    const createdAlbums = await prisma.album.createMany({
      data: albums,
    });

    // Get the created albums to create related records
    const albumRecords = await prisma.album.findMany({
      take: batchSize,
      orderBy: { id: 'desc' },
    });

    // Create songs and images for each album
    for (const album of albumRecords) {
      // Create songs in batch
      const songs = Array.from({ length: 100 }, () => ({
        name: faker.music.songName(),
        duration: `${faker.number.int({ min: 1, max: 10 })}:${faker.number.int({ min: 0, max: 59 }).toString().padStart(2, '0')}`,
        albumId: album.id,
      }));

      await prisma.song.createMany({
        data: songs,
      });

      // Create images in batch
      const images = Array.from({ length: 5 }, () => ({
        url: faker.image.url(),
        albumId: album.id,
      }));

      await prisma.image.createMany({
        data: images,
      });
    }

    console.log(`Created ${i + albumRecords.length} albums...`);
  }

  console.log('Database population completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 