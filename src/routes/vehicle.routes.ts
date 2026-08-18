import { Router } from "express";
import { VehicleController } from "../controllers/vehicle.controller";
import { upload } from "../middlewares/upload.middleware";

const vehicleRoutes = Router();
const vehicleController = new VehicleController();

vehicleRoutes.get("/", vehicleController.getAll);
vehicleRoutes.get("/:id", vehicleController.getById);
vehicleRoutes.delete("/:id", vehicleController.SoftDelete);
vehicleRoutes.post("/", upload.single("photo"), vehicleController.create);

export default vehicleRoutes;
