import fs from "fs/promises";
import Joi from "joi";
import { VehicleService } from "../services/vehicle.service";
import { Request, Response } from "express";

const vehicleSchema = Joi.object({
  name: Joi.string().required(),
  plate_number: Joi.string().required(),
  category: Joi.string().required(),
  daily_rate: Joi.number().positive().required(),
});

export class VehicleController {
  private vehicleService: VehicleService;

  constructor() {
    this.vehicleService = new VehicleService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const { error, value } = vehicleSchema.validate(req.body);
      if (error) {
        if (req.file) await fs.unlink(req.file.path).catch(() => {});
        return res.status(400).json({ error: error.details[0].message });
      }
      const vehicleData = { ...value };
      if (req.file) {
        vehicleData.photo_path = req.file.path;
      }

      try {
        const newVehicle = await this.vehicleService.createVehicle(vehicleData);
        res.status(201).json(newVehicle);
      } catch (dbErr: any) {
        if (req.file) await fs.unlink(req.file.path).catch(() => {});
        if (dbErr.code === "23505") {
          // Postgres unique violation code
          res.status(409).json({ error: "Plate number already exists" });
          return;
        }
        throw dbErr;
      }
    } catch (error) {
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
