import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("No Authorization header");
    return res.sendStatus(401); // Unauthorized
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("No token found");
    return res.sendStatus(401); // Unauthorized
  }

  console.log("Token received:", token);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification error:", err);
      return res.sendStatus(403); // Forbidden
    }

    req.user = user;

    console.log("User data:", user);
    next(); // Proceed to the next middleware or route handler
  });
};

export const authorizeRole = (roles) => (req, res, next) => {
  console.log("Authorizing role:", req.user.role);
  if (!roles.includes(req.user.role)) {
    console.log("User role not authorized");
    return res.sendStatus(403); // Forbidden
  }
  next();
};

// Rate limit middleware
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
