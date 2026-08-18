import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/auth.routes";
import vehicleRoutes from "./routes/vehicle.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", router);
app.use("/vehicles", vehicleRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

export default app;
