import { Router } from "express";
import { RentalController } from "../controllers/rental.controller";
import { authenticateJwt } from "../middlewares/auth.middleware";

const rentalRoutes = Router();

const rentalController = new RentalController();

rentalRoutes.use(authenticateJwt);

rentalRoutes.post("/", rentalController.create);
rentalRoutes.get("/", rentalController.getAll);

export default rentalRoutes;
