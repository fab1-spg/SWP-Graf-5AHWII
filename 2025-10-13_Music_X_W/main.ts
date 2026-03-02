import { fakerDE_AT} from "@faker-js/faker";

const music_Faker = fakerDE_AT.music;
console.log("Musik-Genre: ", music_Faker.genre());
console.log("Musik-Album: ", music_Faker.album());
console.log("Musik-Künstler: ", music_Faker.artist());
console.log("Musik-Song: ", music_Faker.songName());
