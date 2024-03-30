import mongoose from "mongoose";

const dbconnect = async () => {
  try {
    mongoose
      .connect(process.env.DB_URI, { useUnifiedTopology: true })
      .then((data) => {
        console.log(`mongodb connected with server: ${data.connection.host}`);
      });
  } catch (error) {
    console.log(error);
  }
};

export default dbconnect;
