const { query } = require('../db');

exports.getRecent = async (req, res, next) => {
  try {
    const { userId } = req;
    const limit = parseInt(req.query.limit) || 5;

    const txnsRes = await query(`
      SELECT t.id, t.merchant, c.name as category, t.amount, t.type, 
             t.payment_method as "paymentMethod", t.status, t.transaction_date as date
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
      ORDER BY t.transaction_date DESC, t.id DESC
      LIMIT $2
    `, [userId, limit]);

    res.json(txnsRes.rows);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { userId } = req;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    
    const offset = (page - 1) * limit;

    let queryStr = `
      SELECT t.id, t.merchant, c.name as category, t.amount, t.type, 
             t.payment_method as "paymentMethod", t.status, t.transaction_date as date
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
    `;
    const params = [userId];

    if (search) {
      queryStr += ` AND (t.merchant ILIKE $2 OR c.name ILIKE $2 OR t.notes ILIKE $2) `;
      params.push(`%${search}%`);
    }

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) FROM (${queryStr}) as sub`;
    const countRes = await query(countQuery, params);
    const total = parseInt(countRes.rows[0].count);

    queryStr += ` ORDER BY t.transaction_date DESC, t.id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const txnsRes = await query(queryStr, params);

    res.json({
      txns: txnsRes.rows,
      total,
      page,
      limit,
      hasMore: (offset + limit) < total
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { userId } = req;
    const { merchant, amount, type, category_id, payment_method, transaction_date, notes } = req.body;

    if (!merchant || !amount || !type || !category_id || !transaction_date) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newTxn = await query(`
      INSERT INTO transactions (user_id, merchant, amount, type, category_id, payment_method, transaction_date, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [userId, merchant, amount, type, category_id, payment_method, transaction_date, notes]);

    res.status(201).json({ success: true, data: newTxn.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const { merchant, amount, type, category_id, payment_method, transaction_date, notes } = req.body;

    const updateTxn = await query(`
      UPDATE transactions 
      SET merchant = COALESCE($1, merchant), 
          amount = COALESCE($2, amount), 
          type = COALESCE($3, type), 
          category_id = COALESCE($4, category_id), 
          payment_method = COALESCE($5, payment_method), 
          transaction_date = COALESCE($6, transaction_date), 
          notes = COALESCE($7, notes)
      WHERE id = $8 AND user_id = $9
      RETURNING *
    `, [merchant, amount, type, category_id, payment_method, transaction_date, notes, id, userId]);

    if (updateTxn.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Transaction not found or unauthorized' });
    }

    res.json({ success: true, data: updateTxn.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    const delTxn = await query(`
      DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id
    `, [id, userId]);

    if (delTxn.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Transaction not found or unauthorized' });
    }

    res.json({ success: true, message: 'Transaction deleted' });
  } catch (err) {
    next(err);
  }
};
