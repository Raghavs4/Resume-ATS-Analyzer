import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const authentication = async (req, res, next) => {
  try {
    console.log("AUTH HEADER:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    // const user = await User.findById(decoded.id);
    const user = await User.findById(decoded.id || decoded.userId);
    

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default authentication;
