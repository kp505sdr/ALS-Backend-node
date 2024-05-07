import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const token = req.headers["authorization"];
try {
    
   
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    req.authData = authData;

    next();
  });

} catch (error) {
    return res.status(400).json({ message: "Internal server Error" });
}
};

export default authUser;
