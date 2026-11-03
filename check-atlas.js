// Tests your connection to MongoDB Atlas.
// Run:  MONGODB_URI="your-connection-string" node check-atlas.js
// (On Windows PowerShell:  $env:MONGODB_URI="your-connection-string"; node check-atlas.js)

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is not set. Put your Atlas connection string in it.");
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  try {
    await client.connect();
    console.log("Connected to Atlas.");

    const db = client.db("practice_db");
    const users = db.collection("users");

    // Practice: create a unique index (like the ones your real app may need)
    await users.createIndex({ email: 1 }, { unique: true });
    console.log("Unique index on email is ready.");

    // Practice: insert one document, ignore if it already exists
    await users.updateOne(
      { email: "test@example.com" },
      { $setOnInsert: { name: "Test User", createdAt: new Date() } },
      { upsert: true }
    );
    console.log("Test document saved.");

    console.log("Documents in users:", await users.countDocuments());
    console.log("Indexes:", (await users.indexes()).map((i) => i.name));
  } catch (err) {
    console.error("Connection failed:", err.message);
    console.error("Check: 1) IP allowlist in Network Access  2) username/password  3) special characters in password need URL-encoding");
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();