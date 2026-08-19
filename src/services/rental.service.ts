import { RentalRepository } from "../repositories/rental.repository";
import { VehicleRepository } from "../repositories/vehicle.repository";
import { CreateRentalDTO } from "../types";

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
}
