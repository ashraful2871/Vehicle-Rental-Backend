import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtPayload } from "../types";

export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHandler = req.headers.authorization;

  if (!authHandler || !authHandler.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  const token = authHandler.split(" ")[1];

  try {
    const decoded = jwt.verify(
      process.env.JWT_SECRET as string,
      token,
    ) as jwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};
