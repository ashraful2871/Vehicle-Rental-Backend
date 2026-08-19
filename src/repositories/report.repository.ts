import knex from "knex";
import config from "../db/knexfile";

const knexInstance = knex(config.development);

export class ReportRepository {
  async getMonthlyReport(
    monthStart: string,
    monthEnd: string,
    vehicleId?: number,
  ) {
    let query = knexInstance("vehicles")
      .leftJoin("rentals", function () {
        this.on("vehicles.id", "=", "rentals.vehicle_id")
          // FIX: Use knexInstance.raw so Knex treats these as values, not columns
          .andOn(knexInstance.raw("rentals.start_date <= ?", [monthEnd]))
          .andOn(knexInstance.raw("rentals.end_date >= ?", [monthStart]))
          .andOnIn("rentals.status", ["ongoing", "completed"]);
      })
      .select(
        "vehicles.id",
        "vehicles.name",
        knexInstance.raw("COUNT(rentals.id)::int as total_bookings"),

        knexInstance.raw(
          `
          COALESCE(
            SUM(
              CASE 
                WHEN rentals.id IS NOT NULL THEN 
                  (LEAST(rentals.end_date, CAST(? AS DATE)) - GREATEST(rentals.start_date, CAST(? AS DATE))) + 1
                ELSE 0 
              END
            ), 0
          )::int as days_rented
        `,
          [monthEnd, monthStart],
        ),

        knexInstance.raw(
          `
          COALESCE(
            SUM(
              CASE 
                WHEN rentals.id IS NOT NULL THEN 
                  ((LEAST(rentals.end_date, CAST(? AS DATE)) - GREATEST(rentals.start_date, CAST(? AS DATE))) + 1) * vehicles.daily_rate
                ELSE 0 
              END
            ), 0
          )::numeric as revenue
        `,
          [monthEnd, monthStart],
        ),
      )
      .whereNull("vehicles.deleted_at")
      .groupBy("vehicles.id", "vehicles.name", "vehicles.daily_rate");

    if (vehicleId) {
      query = query.where("vehicles.id", vehicleId);
    }

    return query;
  }
}
