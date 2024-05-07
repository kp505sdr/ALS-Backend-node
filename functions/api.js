import express from 'express';
import serverless from 'serverless-http';
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import dbconnect from "../src/configs/dbConnection.js";
import router from "../src/routes/routes.js";
import session from 'express-session';





dotenv.config();
const app = express();
router.get('/', (req, res) => {
  res.send('App is running..');
});


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
app.use('/.netlify/functions/api/v1', router);

// Exporting the handler function using CommonJS syntax
export const handler = serverless(app);

//const port = 8080;
//app.listen(process.env.PORT || port, () => {
//	console.log(`Listening on port ${port}`);
//});