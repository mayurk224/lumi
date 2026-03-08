const mongoose = require("mongoose");
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const URI = process.env.MONGO_URI;

if (!URI) {
  console.error("Error: MONGO_URI environment variable is missing.");
  process.exit(1);
}

const connectToDb = async () => {
  await mongoose.connect(URI);
  console.log("Connected to db");
};

module.exports = connectToDb;
