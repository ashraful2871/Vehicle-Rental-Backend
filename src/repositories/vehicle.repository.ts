import knex from "knex";
import config from "../db/knexfile";
import { CreateVehicleDTO, Vehicle } from "../types";

const knexInstance = knex(config.development);

export class VehicleRepository {
  async findAll(
    page: number,
    limit: number,
    category?: string,
    search?: string,
  ) {
    const offset = (page - 1) * limit;

    let query = knexInstance("vehicles").whereNull("deleted_at");

    if (category) {
      query = query.where("category", category);
    }

    if (search) {
      query = query.where("name", "like", `%${search}%`);
    }
    const [{ count }] = await query.clone().count("id as count");
    const data = await query.limit(limit).offset(offset).orderBy("id", "desc");
    return {
      data,
      total: Number(count),
      page,
      limit,
      totalStorage: Math.ceil(Number(count) / limit),
    };
  }

  async findById(id: number) {
    return knexInstance("vehicles")
      .where({ id })
      .whereNull("deleted_at")
      .first();
  }

  async SoftDelete(id: number) {
    return knexInstance("vehicles")
      .where({ id })
      .whereNull("deleted_at")
      .update({ deleted_at: new Date() });
  }

  async create(data: CreateVehicleDTO): Promise<Vehicle> {
    const [id] = await knexInstance("vehicles").insert(data).returning("id");

    return this.findById(
      typeof id === "number" ? id : id.id,
    ) as Promise<Vehicle>;
  }
}
