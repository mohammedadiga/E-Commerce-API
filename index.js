import express from "express";

// Package dependencies
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// To read the .env file
import dotenv from "dotenv/config";

// My Hokies
import dbConnection from "./config/dbConnection.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";


const app = express();

// Host Port
const PORT = process.env.PORT || 4000;

// Routes
// const authRoute = require("./routes/authRoute");
import authRoute from "./routes/authRoute.js";

// mongo database connection
dbConnection();

// API body request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cookie Parser
app.use(cookieParser());

// App routes
app.use("/api/auth", authRoute);

// App Error Handler
app.use(notFound);
app.use(errorHandler);

// App statar
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
