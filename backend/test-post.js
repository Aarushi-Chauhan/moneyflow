const jwt = require('jsonwebtoken');
const { query } = require('./src/db');
require('dotenv').config();
const http = require('http');

async function test() {
  try {
    const users = await query('SELECT id, email FROM users LIMIT 1');
    if (users.rows.length === 0) return console.log('No users');
    const user = users.rows[0];
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_dev';
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
    
    // Find an expense category to use
    const cats = await query('SELECT id FROM categories WHERE type=$1 LIMIT 1', ['expense']);
    const catId = cats.rows.length > 0 ? cats.rows[0].id : '1';

    const postData = JSON.stringify({
      category_id: catId,
      limit_amount: 1000,
      start_date: "2026-09-01",
      end_date: "2026-09-30"
    });

    const req = http.request({
      hostname: 'localhost',
      port: 5001,
      path: '/api/budgets',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      console.log('STATUS:', res.statusCode);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => console.log('Response:', data));
    });

    req.write(postData);
    req.end();
  } catch (e) { console.error(e); }
}
test();
