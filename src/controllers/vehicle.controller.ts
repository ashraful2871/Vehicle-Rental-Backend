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

const updateVehicleSchema = vehicleSchema.fork(
  ["name", "plate_number", "category", "daily_rate"],
  (schema) => schema.optional(),
);

export class VehicleController {
  private vehicleService: VehicleService;

  constructor() {
    this.vehicleService = new VehicleService();
  }
  getAll = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;

    try {
      const vehicles = await this.vehicleService.getAllVehicles(
        page,
        limit,
        category,
        search,
      );
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  getById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
      const vehicle = await this.vehicleService.getVehicleById(id);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { error, value } = updateVehicleSchema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const vehicleData = { ...value };
      if (req.file) {
        vehicleData.photo_path = req.file.path;
      }

      const updatedVehicle = await this.vehicleService.updateVehicle(
        Number(req.params.id),
        vehicleData,
      );
      if (!updatedVehicle) {
        res.status(404).json({ error: "Vehicle not found" });
        return;
      }

      res.json(updatedVehicle);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  SoftDelete = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      const findVehicle = await this.vehicleService.getVehicleById(id);
      if (!findVehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      await this.vehicleService.SoftDelete(id);
      res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
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
