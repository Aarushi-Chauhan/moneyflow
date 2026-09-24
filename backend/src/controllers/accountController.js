const { query } = require('../db');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
  try {
    const userResult = await query(
      'SELECT id, name, email, avatar_url, created_at, updated_at FROM users WHERE id = $1',
      [req.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: userResult.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, avatarUrl } = req.body;

    const userResult = await query(
      'UPDATE users SET name = COALESCE($1, name), avatar_url = COALESCE($2, avatar_url), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, email, avatar_url',
      [name, avatarUrl, req.userId]
    );

    res.json({ success: true, data: userResult.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const result = await query('SELECT * FROM user_preferences WHERE user_id = $1', [req.userId]);
    res.json({ success: true, data: result.rows[0] || {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { currency, dateFormat, theme } = req.body;
    
    const result = await query(
      `UPDATE user_preferences 
       SET currency = COALESCE($1, currency), 
           date_format = COALESCE($2, date_format), 
           theme = COALESCE($3, theme), 
           updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = $4 RETURNING *`,
      [currency, dateFormat, theme, req.userId]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getNotificationPreferences = async (req, res) => {
  try {
    const result = await query('SELECT * FROM notification_preferences WHERE user_id = $1', [req.userId]);
    res.json({ success: true, data: result.rows[0] || {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateNotificationPreferences = async (req, res) => {
  try {
    const { budgetAlerts, weeklySummary, aiInsights } = req.body;
    
    const result = await query(
      `UPDATE notification_preferences 
       SET budget_alerts = COALESCE($1, budget_alerts), 
           weekly_summary = COALESCE($2, weekly_summary), 
           ai_insights = COALESCE($3, ai_insights), 
           updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = $4 RETURNING *`,
      [budgetAlerts, weeklySummary, aiInsights, req.userId]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAiPreferences = async (req, res) => {
  try {
    const result = await query('SELECT * FROM ai_preferences WHERE user_id = $1', [req.userId]);
    res.json({ success: true, data: result.rows[0] || {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateAiPreferences = async (req, res) => {
  try {
    const { financialInsights, monthlySummary, proactiveInsights } = req.body;
    
    const result = await query(
      `UPDATE ai_preferences 
       SET financial_insights = COALESCE($1, financial_insights), 
           monthly_summary = COALESCE($2, monthly_summary), 
           proactive_insights = COALESCE($3, proactive_insights), 
           updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = $4 RETURNING *`,
      [financialInsights, monthlySummary, proactiveInsights, req.userId]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const userRes = await query('SELECT password_hash FROM users WHERE id = $1', [req.userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const isValid = await bcrypt.compare(currentPassword, userRes.rows[0].password_hash);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid current password' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    await query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [passwordHash, req.userId]);
    
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getFinancialProfile = async (req, res) => {
  try {
    const balanceRes = await query(
      `SELECT amount FROM transactions WHERE user_id = $1 AND notes = 'Account Setup' LIMIT 1`,
      [req.userId]
    );
    const incomeRes = await query(
      `SELECT amount FROM recurring_income WHERE user_id = $1 AND name = 'Monthly Salary' LIMIT 1`,
      [req.userId]
    );

    res.json({ 
      success: true, 
      data: {
        balance: balanceRes.rows.length > 0 ? parseFloat(balanceRes.rows[0].amount) : 0,
        income: incomeRes.rows.length > 0 ? parseFloat(incomeRes.rows[0].amount) : 0,
      } 
    });
  } catch (error) {
    console.error("ERROR in getFinancialProfile:", error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.updateFinancialProfile = async (req, res) => {
  try {
    const { balance, income } = req.body;

    if (balance !== undefined) {
      const bRes = await query(`UPDATE transactions SET amount = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND notes = 'Account Setup' RETURNING id`, [balance, req.userId]);
      if (bRes.rows.length === 0 && balance > 0) {
        // Find category
        const catRes = await query(`SELECT id FROM categories WHERE user_id = $1 AND name = 'Starting Balance' LIMIT 1`, [req.userId]);
        if (catRes.rows.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          await query(
            `INSERT INTO transactions (user_id, category_id, merchant, amount, type, payment_method, transaction_date, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [req.userId, catRes.rows[0].id, 'Initial Balance', balance, 'income', 'bank_transfer', today, 'Account Setup']
          );
        }
      }
    }

    if (income !== undefined) {
      const iRes = await query(`UPDATE recurring_income SET amount = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND name = 'Monthly Salary' RETURNING id`, [income, req.userId]);
      if (iRes.rows.length === 0 && income > 0) {
        const catRes = await query(`SELECT id FROM categories WHERE user_id = $1 AND name = 'Salary' LIMIT 1`, [req.userId]);
        if (catRes.rows.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          const nextMonth = new Date();
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          const nextOccurrenceStr = nextMonth.toISOString().split('T')[0];

          await query(
            `INSERT INTO recurring_income (user_id, name, amount, category_id, frequency, start_date, next_occurrence) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [req.userId, 'Monthly Salary', income, catRes.rows[0].id, 'monthly', today, nextOccurrenceStr]
          );
        }
      }
    }

    res.json({ success: true, message: 'Financial profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
