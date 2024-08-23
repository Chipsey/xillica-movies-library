const express = require("express");
const connectDB = require("./config/mongodb-connection");
const dotenv = require("dotenv");
const logger = require("./utils/logger");

const userRoutes = require("./routes/user-routes");
const favoriteRoutes = require("./routes/favorite-routes");

const cors = require("cors");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger(
    `Server running on ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ port ${PORT}`
  );
});
