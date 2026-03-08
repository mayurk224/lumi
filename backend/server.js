require("dotenv").config();
const connectToDb = require("./config/database");
const app = require("./src/app");

const PORT = Number(process.env.PORT) || 3000;

connectToDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });
