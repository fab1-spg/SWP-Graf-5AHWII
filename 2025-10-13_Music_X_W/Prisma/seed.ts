import { PrismaClient } from "./generated/client.ts";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});
async function main() {
    // Clear existing data
    await prisma.song.deleteMany();
    await prisma.album.deleteMany();
    await prisma.artist.deleteMany();
    await prisma.genre.deleteMany();

    // Create 5 genres
    for (let i = 0; i < 5; i++) {
        await prisma.genre.create({
            data: {
                name: faker.music.genre(),
            },
        });
    }
    const genres = await prisma.genre.findMany();

    // Create 5 artists
    for (let i = 0; i < 5; i++) {
            await prisma.artist.create({
                data: {
                    name: faker.music.artist(),
                },
            });
    }
    const artists = await prisma.artist.findMany();

    // Create 5 albums
    for (let i = 0; i < 5; i++) {
        await prisma.album.create({
            data: {
                title: faker.music.album(),
                releaseYear: faker.date.past({ years: 10 }).getFullYear(),
                artists: {
                        connect: faker.helpers.arrayElements(artists, { min:1, max:3,}).map((artist) => ({ id: artist.id })),
                },
            },
        });
    }
    const albums = await prisma.album.findMany();

    // Create 5 songs per album (25 songs total)
    for (const album of albums) {
        const albumArtists = faker.helpers.arrayElements(artists, {
            min: 1,
            max: 3,
        });

        for (let i = 0; i < 5; i++) {
            await prisma.song.create({
                data: {
                    title: faker.music.songName(),
                    duration: faker.number.int({ min: 120, max: 360 }), // duration in seconds
                    genre: {
                        connect: { id: faker.helpers.arrayElement(genres).id },
                    },
                    album: {
                        connect: { id: album.id },
                    },
                    artists: {
                        connect: albumArtists.map((artist) => ({ id: artist.id })),
                    },
                },
            });
        }
    }

    console.log("Seed completed successfully!");
    console.log(
        `Created: ${artists.length} artists, ${albums.length} albums, ${albums.length * 5
        } songs, ${genres.length} genres`,
    );
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });