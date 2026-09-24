const jwt = require('jsonwebtoken');
const { query } = require('./src/db');
require('dotenv').config();

async function test() {
  try {
    const users = await query('SELECT id, email FROM users LIMIT 1');
    if (users.rows.length === 0) {
      console.log('No users found');
      process.exit(1);
    }
    const user = users.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'supersecretkey123', { expiresIn: '1h' });
    
    const resGet = await fetch('http://localhost:5001/api/budgets', {
      headers: { 'Cookie': `token=${token}` }
    });
    console.log('GET /budgets STATUS:', resGet.status);
    if (!resGet.ok) console.log(await resGet.text());

  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
test();
