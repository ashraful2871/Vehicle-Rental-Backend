import knex from 'knex';
import config from '../src/db/knexfile';
const db = knex(config.development);

async function run() {
  try {
    const cols = await db('vehicles').columnInfo();
    console.log("Columns:", Object.keys(cols));
    
    const index = await db.raw(`SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'vehicles'`);
    console.log("Indexes:", index.rows);
  } catch(err) {
    console.error(err);
  } finally {
    db.destroy();
  }
}
run();
