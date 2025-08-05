import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let db: PostgresJsDatabase<typeof schema>;

try {
  const client = postgres(process.env.DATABASE_URL!, {
    max: 1, // Set max connections to 1 for simplicity
    idle_timeout: 10, // Set idle timeout to 10 seconds
    connect_timeout: 10, // Add connect timeout (seconds)
    onnotice: (notice) => {
      console.warn("Postgres notice:", notice);
    },
  });
  db = drizzle(client, { schema });
} catch (error) {
  console.error("Failed to connect to the database:", error);
  throw error;
}

export default db;

export type Advocate = {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: string;
  phoneNumber: string;
};