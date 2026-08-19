import knex from "knex";
import { CreateRentalDTO, Rental } from "../types";
import config from "../db/knexfile";

const knexInstance = knex(config.development);
export class RentalRepository {
  private checkOverlapQuery(
    builder: knex.Knex.QueryBuilder,
    vehicleId: number,
    startDate: string,
    endDate: string,
    excludeRentalId?: number,
  ) {
    builder
      .where("vehicle_id", vehicleId)
      .whereIn("status", ["booked", "ongoing"])
      .andWhere("start_date", "<=", endDate)
      .andWhere("end_date", ">=", startDate);

    if (excludeRentalId) {
      builder.whereNot("id", excludeRentalId);
    }
    return builder;
  }

  async create(data: CreateRentalDTO, amount: number): Promise<Rental> {
    return knexInstance.transaction(async (trx) => {
      const overlap = await this.checkOverlapQuery(
        trx("rentals"),
        data.vehicle_id,
        data.start_date,
        data.end_date,
      ).first();

      if (overlap) {
        throw new Error("OVERLAP_ERROR");
      }

      const [id] = await trx("rentals")
        .insert({
          ...data,
          total_amount: amount,
          status: "booked",
        })
        .returning("id");

      const result = await trx("rentals")
        .where({ id: typeof id === "number" ? id : id.id })
        .first();
      return result as Rental;
    });
  }
  async findAll(
    page: number,
    limit: number,
    vehicleId?: number,
    status?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const offset = (page - 1) * limit;
    let query = knexInstance("rentals");

    if (vehicleId) query = query.where("vehicle_id", vehicleId);
    if (status) query = query.where("status", status);
    if (startDate && endDate) {
      query = query
        .where("start_date", ">=", startDate)
        .andWhere("end_date", "<=", endDate);
    }

    const [{ count }] = await query.clone().count("id as count");
    const data = await query.limit(limit).offset(offset).orderBy("id", "desc");

    return {
      data,
      total: Number(count),
      page,
      limit,
      totalPages: Math.ceil(Number(count) / limit),
    };
  }
}
