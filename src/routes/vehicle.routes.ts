import { Router } from "express";
import { VehicleController } from "../controllers/vehicle.controller";
import { upload } from "../middlewares/upload.middleware";

const vehicleRoutes = Router();
const vehicleController = new VehicleController();

vehicleRoutes.post("/", upload.single("photo"), vehicleController.create);

export default vehicleRoutes;
