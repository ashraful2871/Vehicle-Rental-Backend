import Joi from "joi";
import { AuthService } from "../services/auth.service";
import { NextFunction, Request, Response } from "express";

const loginSchemas = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { error, value } = loginSchemas.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const token = await this.authService.login(value.email, value.password);
      if (!token) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }
      res.json({ token });
    } catch (error: any) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
