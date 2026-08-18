import { VehicleRepository } from "../repositories/vehicle.repository";
import { CreateVehicleDTO } from "../types";

export class VehicleService {
  private vehicleRepository: VehicleRepository;

  constructor() {
    this.vehicleRepository = new VehicleRepository();
  }

  async createVehicle(data: CreateVehicleDTO) {
    return this.vehicleRepository.create(data);
  }
}
