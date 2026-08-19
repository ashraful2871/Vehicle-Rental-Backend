import { Router } from "express";
import { authenticateJwt } from "../middlewares/auth.middleware";
import { ReportController } from "../controllers/report.controller";

const reportRoute = Router();
const reportController = new ReportController();

reportRoute.use(authenticateJwt);

reportRoute.get("/rentals", reportController.getRentalsReport);

export default reportRoute;
