import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import dbconnect from "./src/configs/dbConnection.js";
import router from "./src/routes/routes.js";



dotenv.config();
const app = express();

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

//port and route setup
const PORT=process.env.PORT||5000
app.use("/api/v1",router)

app.listen(PORT,()=>{
    console.log(`App listening on port ${PORT}`);
})