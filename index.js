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
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";

// mongo database connection
dbConnection();

// API body request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cookie Parser
app.use(cookieParser());

// App routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

// App Error Handler
app.use(notFound);
app.use(errorHandler);

// App statar
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
