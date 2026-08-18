import type { Knex } from "knex";
import bcrypt from "bcrypt";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("rentals").del();
  await knex("vehicles").del();
  await knex("staff").del();

  const passwordHash = await bcrypt.hash("admin123", 10);
  await knex("staff").insert([
    {
      id: 1,
      name: "Admin user",
      email: "admin@rental.com",
      password_hash: passwordHash,
    },
  ]);

  // seed vehicles
  await knex("vehicles").insert([
    {
      id: 1,
      name: "Toyota Camry",
      plate_number: "ABC-123",
      category: "Sedan",
      daily_rate: 50.0,
    },
    {
      id: 2,
      name: "Ford Explorer",
      plate_number: "XYZ-789",
      category: "SUV",
      daily_rate: 80.0,
    },
  ]);

  await knex("rentals").insert([
    {
      id: 1,
      vehicle_id: 1,
      customer_name: "John Doe",
      customer_phone: "555-0100",
      start_date: "2024-07-29",
      end_date: "2024-08-03",
      total_amount: 300.0,
      status: "completed",
    },
  ]);
}
