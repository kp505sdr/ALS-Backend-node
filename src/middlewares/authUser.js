import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
  const token = req.headers["authorization"];

  // console.log("get token =>", token);
  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
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

//Protected Routes token base
// export const requireSignIn = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization;
//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized: No token provided" });
//     }

//     const decode = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
//     req.user = decode;
//     next();
//   } catch (error) {
//     console.log(error);
//     return res.status(403).json({ message: "Forbidden: Invalid token" });
//   }
// };
// export default authUser;

import userModel from "../models/userModels.js";
//admin acceess

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.authData.userId);

    if (!user.isAdmin) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};

export const isUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.authData.userId);

    if (user.isAdmin) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};
