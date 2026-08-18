import { VehicleRepository } from "../repositories/vehicle.repository";
import { CreateVehicleDTO } from "../types";

export class VehicleService {
  private vehicleRepository: VehicleRepository;

  constructor() {
    this.vehicleRepository = new VehicleRepository();
  }

  async getAllVehicles(
    page: number,
    limit: number,
    category?: string,
    search?: string,
  ) {
    return this.vehicleRepository.findAll(page, limit, category, search);
  }

  async getVehicleById(id: number) {
    return this.vehicleRepository.findById(id);
  }

  async SoftDelete(id: number) {
    return this.vehicleRepository.SoftDelete(id);
  }
  async createVehicle(data: CreateVehicleDTO) {
    return this.vehicleRepository.create(data);
  }
}
