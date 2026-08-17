import { Staff } from "../types";
import knex from "knex";
import config from "../db/knexfile";

const knexInstance = knex(config.development);

export class StaffRepository {
  async findByEmail(email: string): Promise<Staff | undefined> {
    return knexInstance<Staff>("staff").where({ email }).first();
  }
}
