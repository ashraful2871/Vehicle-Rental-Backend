import { RentalRepository } from "../repositories/rental.repository";
import { VehicleRepository } from "../repositories/vehicle.repository";
import { CreateRentalDTO, UpdateRentalDTO } from "../types";

export class RentalService {
  private rentalRepository = new RentalRepository();
  private vehicleRepository = new VehicleRepository();

  private calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  }

  async createRental(data: CreateRentalDTO) {
    const vehicle = await this.vehicleRepository.findById(data.vehicle_id);
    if (!vehicle) throw new Error("VEHICLE_NOT_FOUND");

    const days = this.calculateDays(data.start_date, data.end_date);
    const totalAmount = days * vehicle.daily_rate;

    return this.rentalRepository.create(data, totalAmount);
  }

  async getRentals(
    page: number,
    limit: number,
    vehicleId?: number,
    status?: string,
    startDate?: string,
    endDate?: string,
  ) {
    return this.rentalRepository.findAll(
      page,
      limit,
      vehicleId,
      status,
      startDate,
      endDate,
    );
  }

  async getRentalById(id: number) {
    return this.rentalRepository.findById(id);
  }

  async updateRental(id: number, data: UpdateRentalDTO) {
    let totalAmount: number | undefined;

    if (data.start_date || data.end_date || data.vehicle_id) {
      const existing = await this.rentalRepository.findById(id);
      if (!existing) throw new Error("NOT_FOUND");

      const vehicleId = data.vehicle_id || existing.vehicle_id;
      const vehicle = await this.vehicleRepository.findById(vehicleId);
      if (!vehicle) throw new Error("VEHICLE_NOT_FOUND");

      const start = (data.start_date || existing.start_date) as string;
      const end = (data.end_date || existing.end_date) as string;

      const days = this.calculateDays(start, end);
      totalAmount = days * vehicle.daily_rate;
    }

    return this.rentalRepository.update(id, data, totalAmount);
  }

  async deleteRental(id: number) {
    return this.rentalRepository.delete(id);
  }
}
