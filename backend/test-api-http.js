const jwt = require('jsonwebtoken');
const { query } = require('./src/db');
require('dotenv').config();
const http = require('http');

async function test() {
  try {
    const users = await query('SELECT id, email FROM users LIMIT 1');
    if (users.rows.length === 0) {
      console.log('No users found');
      process.exit(1);
    }
    const user = users.rows[0];
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_dev';
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
    
    // First, let's test GET
    http.get({
      hostname: 'localhost',
      port: 5001,
      path: '/api/budgets',
      headers: { 'Cookie': `token=${token}` }
    }, (res) => {
      console.log('GET /budgets STATUS:', res.statusCode);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => console.log('GET Response:', data));
    });

  } catch (e) {
    console.error(e);
  }
}
test();
