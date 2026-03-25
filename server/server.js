/**
 * Express application entry: MongoDB connection, middleware, API routes,
 * and static serving of the client/ folder so the portfolio is one deployable unit.
 */

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

/** When true, skip MongoDB and use in-memory review storage (frontend dev without DB). */
function isSkipMongo() {
  const v = String(process.env.SKIP_MONGO || "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

const reviewRoutes = isSkipMongo()
  ? require("./routes/reviewRoutesMemory")
  : require("./routes/reviewRoutes");

const app = express();

// Allow browser requests from any origin during development and flexible hosting
app.use(cors());

// Parse JSON request bodies for POST /api/reviews
app.use(express.json());

// API: visitor reviews
app.use("/api/reviews", reviewRoutes);

// Serve frontend (HTML/CSS/JS) from ../client (index.html at /)
app.use(express.static(path.join(__dirname, "..", "client")));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const skipMongo = isSkipMongo();

function startListening() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

if (skipMongo) {
  console.log("SKIP_MONGO is on — reviews use in-memory storage (cleared when the server stops).");
  startListening();
} else {
  if (!MONGO_URI) {
    console.error("MONGO_URI is missing from environment. Set it in .env, or set SKIP_MONGO=true");
    process.exit(1);
  }

  mongoose
    .connect(MONGO_URI)
    .then(() => {
      const dbName = mongoose.connection.db?.databaseName;
      console.log("MongoDB connected");
      console.log(
        `  → database: "${dbName}" — collection: "reviews" (use the same connection string in Compass/Atlas Data Explorer)`
      );
      startListening();
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      console.error("");
      console.error("  Nothing is accepting connections at your MONGO_URI (often port 27017).");
      console.error("  Options:");
      console.error("    • Frontend only: set SKIP_MONGO=true in .env");
      console.error("    • Docker:  docker compose up -d   (from this project folder)");
      console.error("    • Install MongoDB Community and start the mongod service / run mongod");
      console.error("    • Cloud:   set MONGO_URI in .env to a MongoDB Atlas connection string");
      console.error("");
      process.exit(1);
    });
}
