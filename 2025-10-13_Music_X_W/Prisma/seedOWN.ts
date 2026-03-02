import { fakerDE_AT } from "@faker-js/faker";
import { Prisma, PrismaClient } from "./generated/client.ts";

const music_Faker = fakerDE_AT.music;
const prisma = new PrismaClient();
async function main() {
    for (let i = 0; i < 10; i++) {
        let artistName: string = music_Faker.artist();
        await prisma.artist.create({
            data: {
                name: artistName,
                albums: {},
            },
        });
        console.log(
            await prisma.artist.findUnique({
                where: { name: artistName },
            }),
        );
    }
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });