import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/auth.routes";
import vehicleRoutes from "./routes/vehicle.routes";
import rentalRoutes from "./routes/rental.routes";
import reportRoute from "./routes/report.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", router);
app.use("/vehicles", vehicleRoutes);
app.use("/rentals", rentalRoutes);
app.use("/reports", reportRoute);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

export default app;
