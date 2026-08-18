import { Router } from "express";
import { RentalController } from "../controllers/rental.controller";

const rentalRoutes = Router();

const rentalController = new RentalController();

rentalRoutes.post("/", rentalController.create);

export default rentalRoutes;
