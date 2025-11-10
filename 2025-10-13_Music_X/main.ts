import { PrismaClient } from "./prisma/generated/client/index.ts";
const fakerDE_AT = {
  music: {
    genre: () =>
      ["Pop", "Rock", "Jazz", "Classical", "Hip-Hop", "Electronic"][
        Math.floor(Math.random() * 6)
      ],
    artist: () => `Artist ${Math.floor(Math.random() * 1000)}`,
    album: () => `Album ${Math.floor(Math.random() * 1000)}`,
    songName: () => `Song ${Math.floor(Math.random() * 10000)}`,
  },
  number: {
    int: ({ min, max }: { min: number; max: number }) =>
      Math.floor(Math.random() * (max - min + 1)) + min,
  },
  helpers: {
    arrayElements: <T>(arr: T[], opts: { min: number; max: number }) => {
      const count = Math.max(
        opts.min,
        Math.floor(Math.random() * (opts.max - opts.min + 1)) + opts.min
      );
      const copy = arr.slice();
      const res: T[] = [];
      for (let i = 0; i < Math.min(count, copy.length); i++) {
        const idx = Math.floor(Math.random() * copy.length);
        res.push(copy.splice(idx, 1)[0]);
      }
      return res;
    },
    arrayElement: <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)],
  },
};

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Clear existing data
  await prisma.song.deleteMany();
  await prisma.album.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.genre.deleteMany();

  console.log("Cleared existing data");

  // Create genres
  const genres = await Promise.all(
    Array.from({ length: 10 }, async () => {
      return await prisma.genre.create({
        data: {
          name: fakerDE_AT.music.genre(),
        },
      });
    })
  );

  console.log(`Created ${genres.length} genres`);

  // Create artists
  const artists = await Promise.all(
    Array.from({ length: 20 }, async () => {
      return await prisma.artist.create({
        data: {
          name: fakerDE_AT.music.artist(),
        },
      });
    })
  );

  console.log(`Created ${artists.length} artists`);

  // Create albums
  const albums = await Promise.all(
    Array.from({ length: 15 }, async () => {
      const albumArtists = fakerDE_AT.helpers.arrayElements(artists, {
        min: 1,
        max: 3,
      }) as { id: string }[];

      return await prisma.album.create({
        data: {
          name: fakerDE_AT.music.album(),
          year: fakerDE_AT.number.int({ min: 1990, max: 2024 }),
          artists: {
            connect: albumArtists.map((artist: { id: string }) => ({
              id: artist.id,
            })),
          },
        },
      });
    })
  );

  console.log(`Created ${albums.length} albums`);

  // Create songs
  const songs = await Promise.all(
    Array.from({ length: 50 }, async () => {
      const album = fakerDE_AT.helpers.arrayElement(albums) as { id: string };
      const songArtists = fakerDE_AT.helpers.arrayElements(artists, {
        min: 1,
        max: 2,
      }) as { id: string }[];
      const songGenres = fakerDE_AT.helpers.arrayElements(genres, {
        min: 1,
        max: 2,
      }) as { id: string }[];

      return await prisma.song.create({
        data: {
          name: fakerDE_AT.music.songName(),
          duration: fakerDE_AT.number.int({ min: 120, max: 480 }), // 2-8 minutes in seconds
          album: {
            connect: { id: album.id },
          },
          artists: {
            connect: songArtists.map((artist: { id: string }) => ({
              id: artist.id,
            })),
          },
          genres: {
            connect: songGenres.map((genre: { id: string }) => ({
              id: genre.id,
            })),
          },
        },
      });
    })
  );

  console.log(`Created ${songs.length} songs`);
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    const g: any = globalThis as any;
    if (
      g &&
      typeof g.Deno !== "undefined" &&
      typeof g.Deno.exit === "function"
    ) {
      g.Deno.exit(1);
    } else if (
      g &&
      typeof g.process !== "undefined" &&
      typeof g.process.exit === "function"
    ) {
      g.process.exit(1);
    }
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
