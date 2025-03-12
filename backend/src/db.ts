import { DataSource } from "typeorm";
import { Note } from "./models/Note.ts";
import "dotenv/config";

const DB = process.env.DATABASE_URL;
export const AppDataSource = new DataSource({
  type: "postgres",
  url: DB.replace("<password>", process.env.POSTGRES_PASSWORD),
  entities: [Note],
  migrations: ["src/migrations/*.ts"],
  synchronize: true,
  // dropSchema: true
});
