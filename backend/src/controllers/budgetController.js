const { query } = require('../db');

exports.getAll = async (req, res, next) => {
  try {
    const { userId } = req;
    
    const budgetsRes = await query(`
      SELECT b.id, b.name as budget_name, c.name as category_name, c.id as category_id, 
             b.limit_amount as limit, b.start_date, b.end_date, b.status
      FROM budgets b
      JOIN categories c ON b.category_id = c.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `, [userId]);

    const budgets = [];
    for (const b of budgetsRes.rows) {
      // Calculate spent amount from transactions within the custom date range
      const txnsRes = await query(`
        SELECT COALESCE(SUM(amount), 0) as spent
        FROM transactions
        WHERE user_id = $1 
          AND category_id = $2 
          AND type = 'expense'
          AND transaction_date >= $3 
          AND transaction_date <= $4
      `, [userId, b.category_id, b.start_date, b.end_date]);
      
      const spent = parseFloat(txnsRes.rows[0].spent);
      const limit = parseFloat(b.limit);
      const remaining = limit - spent;
      let percentageUsed = 0;
      if (limit > 0) {
        percentageUsed = (spent / limit) * 100;
      }
      
      let status = 'healthy';
      if (percentageUsed >= 100) status = 'over budget';
      else if (percentageUsed >= 80) status = 'almost reached';

      budgets.push({
        id: b.id,
        name: b.budget_name || `${b.category_name} Budget`,
        category: {
          id: b.category_id,
          name: b.category_name
        },
        limit: limit,
        spent: spent,
        remaining: remaining,
        percentageUsed: percentageUsed,
        status: status,
        startDate: b.start_date,
        endDate: b.end_date
      });
    }

    res.json({ success: true, data: budgets });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { userId } = req;
    const { category_id, limit_amount, name, start_date, end_date } = req.body;
    console.log("POST /budgets body:", req.body);

    if (!category_id) return res.status(400).json({ success: false, message: 'Missing category_id' });
    if (limit_amount === undefined || limit_amount === null) return res.status(400).json({ success: false, message: 'Missing limit_amount' });
    if (!start_date) return res.status(400).json({ success: false, message: 'Missing start_date' });
    if (!end_date) return res.status(400).json({ success: false, message: 'Missing end_date' });

    if (parseFloat(limit_amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Budget limit must be greater than 0' });
    }

    // Verify category exists and is an expense
    const catCheck = await query(`SELECT name, type FROM categories WHERE id = $1 AND user_id = $2`, [category_id, userId]);
    if (catCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    if (catCheck.rows[0].type !== 'expense') {
      return res.status(400).json({ success: false, message: 'Budgets can only be created for expense categories' });
    }
    const catName = catCheck.rows[0].name;
    const budgetName = name || `${catName} Budget`;

    // Prevent overlapping active budgets for the same category
    const dupCheck = await query(`
      SELECT id FROM budgets 
      WHERE user_id = $1 AND category_id = $2 AND status = 'active'
      AND (start_date <= $4 AND end_date >= $3)
    `, [userId, category_id, start_date, end_date]);
    
    if (dupCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'An active budget already exists for this category in this date range.' });
    }

    const newBudget = await query(`
      INSERT INTO budgets (user_id, category_id, limit_amount, name, start_date, end_date, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'active')
      RETURNING *
    `, [userId, category_id, limit_amount, budgetName, start_date, end_date]);

    res.status(201).json({ success: true, data: newBudget.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const { limit_amount, name, start_date, end_date, status } = req.body;
    console.log("PUT /budgets params id:", id, "body:", req.body);

    // Validate limit if provided
    if (limit_amount !== undefined && parseFloat(limit_amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Budget limit must be greater than 0' });
    }

    const updateBudget = await query(`
      UPDATE budgets 
      SET limit_amount = COALESCE($1, limit_amount),
          name = COALESCE($2, name),
          start_date = COALESCE($3, start_date),
          end_date = COALESCE($4, end_date),
          status = COALESCE($5, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6 AND user_id = $7
      RETURNING *
    `, [limit_amount, name, start_date, end_date, status, id, userId]);

    if (updateBudget.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Budget not found or unauthorized' });
    }

    res.json({ success: true, data: updateBudget.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    const delBudget = await query(`
      DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING id
    `, [id, userId]);

    if (delBudget.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Budget not found or unauthorized' });
    }

    res.json({ success: true, message: 'Budget deleted' });
  } catch (err) {
    next(err);
  }
};
