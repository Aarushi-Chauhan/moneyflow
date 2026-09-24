const { query } = require('./src/db');

async function migrate() {
  console.log('Starting migration...');
  try {
    await query(`
      ALTER TABLE budgets 
      ADD COLUMN IF NOT EXISTS end_date DATE;

      -- Update existing rows that were assumed to be monthly
      UPDATE budgets
      SET end_date = start_date + INTERVAL '1 month' - INTERVAL '1 day'
      WHERE end_date IS NULL;
    `);
  } catch (err) {
    console.error('Migration failed:', err);
  }
  process.exit();
}

migrate();
