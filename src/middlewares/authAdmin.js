import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

const authAdmin = async (req, res, next) => {
  const token = req.headers["authorization"];

  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, async (err, authData) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }

      try {
        const user = await User.findById(authData.userId);
     
        if (!user.isAdmin) { // Check if isAdmin is true
          return res.status(403).json({ message: "Forbidden: Only admin Access" });
        }

        req.authData = authData;
        next();
      } catch (error) {
        console.error("Error finding user:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ message: "Internal server Error" });
  }
};

export default authAdmin;
