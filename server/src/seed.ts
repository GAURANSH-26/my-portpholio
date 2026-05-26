import { connectDatabase, disconnectDatabase } from "./db.js";
import { ensureAdminUser } from "./services/adminSeed.js";
import { ensureSiteDocuments } from "./services/siteStore.js";

async function seed() {
  await connectDatabase();
  await ensureSiteDocuments();
  await ensureAdminUser();
  await disconnectDatabase();
  console.log("Seeded admin user and draft/published portfolio content.");
}

seed().catch(async (error) => {
  console.error(error);
  await disconnectDatabase();
  process.exit(1);
});
