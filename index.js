import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import dbconnect from "./src/configs/dbConnection.js";
import router from "./src/routes/routes.js";
import session from 'express-session';

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

//----------express session
app.use(session({
  resave:false,
  saveUninitialized:true,
  secret:"xysddddd"
}))

//port and route setup
const PORT=process.env.PORT||5000
app.use("/api/v1",router)

server.listen(PORT,()=>{
    console.log(`App listening on port ${PORT}`);
})




// -----------------------------------------------------------------------------------------------------


// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import bodyParser from "body-parser";
// import dbconnect from "./src/configs/dbConnection.js";
// import router from "./src/routes/routes.js";
// import http from "http";
// import { Server } from "socket.io";

// dotenv.config();
// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// // Database connection
// dbconnect();

// // Middleware
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Port and route setup
// const PORT = process.env.PORT || 5000;
// app.use("/api/v1", router);

// // Store connected users
// let users = {};

// // Real-time chat
// io.on("connection", (socket) => {
//   console.log("A user connected");

//   // Handle new user connection
//   socket.on("user_connected", (userId) => {
//     // Add the user to the list of connected users
//     users[userId] = socket.id;
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//     // Remove disconnected user from the list of connected users
//     Object.keys(users).forEach((key) => {
//       if (users[key] === socket.id) {
//         delete users[key];
//       }
//     });
//   });
// });
// server.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}`);
// });
