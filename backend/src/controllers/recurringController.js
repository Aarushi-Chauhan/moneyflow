const { query } = require('../db');

exports.getRecurringIncomes = async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM recurring_income WHERE user_id = $1 ORDER BY start_date DESC`,
      [req.userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error getting recurring income:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createRecurringIncome = async (req, res) => {
  try {
    const { name, amount, category_id, frequency, start_date } = req.body;
    
    // Ensure start_date is parsed properly and next_occurrence is set to start_date
    const next_occurrence = start_date;

    const result = await query(
      `INSERT INTO recurring_income (user_id, name, amount, category_id, frequency, start_date, next_occurrence) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.userId, name, amount, category_id, frequency || 'monthly', start_date, next_occurrence]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error creating recurring income:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateRecurringIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, category_id, frequency, status, next_occurrence } = req.body;
    
    const checkRes = await query('SELECT id FROM recurring_income WHERE id = $1 AND user_id = $2', [id, req.userId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Recurring income not found' });
    }

    const result = await query(
      `UPDATE recurring_income 
       SET name = COALESCE($1, name), 
           amount = COALESCE($2, amount), 
           category_id = COALESCE($3, category_id), 
           frequency = COALESCE($4, frequency), 
           status = COALESCE($5, status),
           next_occurrence = COALESCE($6, next_occurrence),
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $7 AND user_id = $8 RETURNING *`,
      [name, amount, category_id, frequency, status, next_occurrence, id, req.userId]
    );
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error updating recurring income:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteRecurringIncome = async (req, res) => {
  try {
    const { id } = req.params;
    
    const checkRes = await query('SELECT id FROM recurring_income WHERE id = $1 AND user_id = $2', [id, req.userId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Recurring income not found' });
    }

    // Rather than hard delete, we set status to inactive so history is preserved
    // But if we want to support actual delete:
    await query('DELETE FROM recurring_income WHERE id = $1 AND user_id = $2', [id, req.userId]);
    res.json({ success: true, message: 'Recurring income deleted successfully' });
  } catch (error) {
    console.error("Error deleting recurring income:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
