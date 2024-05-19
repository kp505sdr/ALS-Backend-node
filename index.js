import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import dbconnect from "./src/configs/dbConnection.js";
import router from "./src/routes/routes.js";
import session from "express-session";
import morgan from "morgan";

import http from "http";

dotenv.config();
const app = express();
const server = http.createServer(app);

//databse connection
dbconnect();

//Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));

//----------express session
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "xysddddd",
  })
);

//port and route setup
const PORT = process.env.PORT || 5000;
app.use("/api/v1", router);

server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
