const { query, pool } = require('./index');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function runSeed() {
  try {
    console.log("Reading init.sql...");
    const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf-8');
    
    console.log("Initializing database tables...");
    await query(initSql);

    console.log("Clearing existing data...");
    await query('TRUNCATE TABLE transactions, budgets, categories, users, user_preferences, notification_preferences, ai_preferences RESTART IDENTITY CASCADE');

    console.log("Inserting user...");
    const passwordHash = await bcrypt.hash('Qwerty@123', 10);
    const userResult = await query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      ["MoneyFlow Admin", "Admin@moneyflow.com", passwordHash]
    );
    const userId = userResult.rows[0].id;

    console.log("Inserting preferences...");
    await query("INSERT INTO user_preferences (user_id, setup_completed) VALUES ($1, true)", [userId]);
    await query("INSERT INTO notification_preferences (user_id) VALUES ($1)", [userId]);
    await query("INSERT INTO ai_preferences (user_id) VALUES ($1)", [userId]);

    console.log("Database seeded successfully with Admin account!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    pool.end();
  }
}

runSeed();
