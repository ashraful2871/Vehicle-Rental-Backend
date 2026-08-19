import Joi from "joi";
import { RentalService } from "../services/rental.service";
import { Request, Response } from "express";

const createRentalSchema = Joi.object({
  vehicle_id: Joi.number().required(),
  customer_name: Joi.string().required(),
  customer_phone: Joi.string().required(),
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().min(Joi.ref("start_date")).required(),
});

export class RentalController {
  private rentalService = new RentalService();

  create = async (req: Request, res: Response) => {
    try {
      const { error, value } = createRentalSchema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const newRental = await this.rentalService.createRental(value);
      res.status(201).json(newRental);
    } catch (err: any) {
      if (err.message === "OVERLAP_ERROR")
        res
          .status(409)
          .json({ error: "Vehicle is already booked for these dates" });
      else if (err.message === "VEHICLE_NOT_FOUND")
        res.status(404).json({ error: "Vehicle not found" });
      else res.status(500).json({ error: "Internal server error" });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const vehicleId = req.query.vehicle_id
        ? parseInt(req.query.vehicle_id as string)
        : undefined;

      const result = await this.rentalService.getRentals(
        page,
        limit,
        vehicleId,
        req.query.status as string,
        req.query.start_date as string,
        req.query.end_date as string,
      );
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const rental = await this.rentalService.getRentalById(
        Number(req.params.id),
      );
      if (!rental) {
        res.status(404).json({ error: "Rental not found" });
        return;
      }
      res.json(rental);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
