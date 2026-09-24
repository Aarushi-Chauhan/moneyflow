const { query } = require('../db');

exports.getSummary = async (req, res, next) => {
  try {
    const { userId } = req;

    // --- RECURRING INCOME GENERATOR ---
    // Find due recurring incomes
    const todayStr = new Date().toISOString().split('T')[0];
    const dueRes = await query(
      `SELECT * FROM recurring_income WHERE user_id = $1 AND status = 'active' AND next_occurrence <= $2`,
      [userId, todayStr]
    );

    for (const recurring of dueRes.rows) {
      // 1. Insert transaction
      await query(
        `INSERT INTO transactions (user_id, category_id, merchant, amount, type, payment_method, transaction_date, recurring_income_id, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [userId, recurring.category_id, recurring.name, recurring.amount, 'income', 'bank_transfer', recurring.next_occurrence, recurring.id, 'Generated from Recurring Income']
      );

      // 2. Update next occurrence (assume monthly for MVP, can be expanded based on frequency)
      const nextDate = new Date(recurring.next_occurrence);
      if (recurring.frequency === 'monthly') {
        nextDate.setMonth(nextDate.getMonth() + 1);
      } else if (recurring.frequency === 'weekly') {
        nextDate.setDate(nextDate.getDate() + 7);
      } else if (recurring.frequency === 'yearly') {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      } else {
        nextDate.setMonth(nextDate.getMonth() + 1); // fallback
      }
      
      const newOccurrenceStr = nextDate.toISOString().split('T')[0];

      await query(
        `UPDATE recurring_income SET next_occurrence = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [newOccurrenceStr, recurring.id]
      );
    }
    // --- END RECURRING INCOME GENERATOR ---

    const incomeRes = await query(`SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = $1 AND type = 'income'`, [userId]);
    const expensesRes = await query(`SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = $1 AND type = 'expense'`, [userId]);
    const prefsRes = await query(`SELECT starting_balance FROM user_preferences WHERE user_id = $1`, [userId]);
    
    const income = parseFloat(incomeRes.rows[0].total);
    const expenses = parseFloat(expensesRes.rows[0].total);
    const startingBalance = prefsRes.rows.length > 0 ? parseFloat(prefsRes.rows[0].starting_balance || 0) : 0;
    
    const savings = income - expenses;
    const totalBalance = startingBalance + income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    res.json({
      totalBalance,
      income,
      expenses,
      savings,
      savingsRate: parseFloat(savingsRate.toFixed(2)),
      comparison: {
        balance: 8.4, // Static mock for now
        income: 2.1,
        expenses: -4.5,
        savings: 12.3
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getCashFlow = async (req, res, next) => {
  try {
    const { userId } = req;
    const { period = '30d' } = req.query; // Could use period to filter, simplified here
    
    // Group by date
    const flowRes = await query(`
      SELECT 
        TO_CHAR(transaction_date, 'YYYY-MM-DD') as date,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expenses
      FROM transactions 
      WHERE user_id = $1
      GROUP BY transaction_date
      ORDER BY transaction_date ASC
    `, [userId]);

    let totalIncome = 0;
    let totalExpenses = 0;

    const data = flowRes.rows.map(row => {
      const income = parseFloat(row.income);
      const expenses = parseFloat(row.expenses);
      totalIncome += income;
      totalExpenses += expenses;
      
      return {
        date: row.date,
        income,
        expenses,
        net: income - expenses
      };
    });

    res.json({
      period,
      flowData: data,
      summary: {
        income: totalIncome,
        expenses: totalExpenses,
        net: totalIncome - totalExpenses
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getSpending = async (req, res, next) => {
  try {
    const { userId } = req;
    const totalRes = await query(`SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = $1 AND type = 'expense'`, [userId]);
    const total = parseFloat(totalRes.rows[0].total);

    const catRes = await query(`
      SELECT c.name as category, COALESCE(SUM(t.amount), 0) as amount
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1 AND t.type = 'expense'
      GROUP BY c.name
      ORDER BY amount DESC
    `, [userId]);

    const categories = catRes.rows.map(row => {
      const amount = parseFloat(row.amount);
      const percentage = total > 0 ? (amount / total) * 100 : 0;
      return {
        category: row.category,
        amount,
        percentage: parseFloat(percentage.toFixed(2))
      };
    });

    res.json({
      total,
      categories
    });
  } catch (err) {
    next(err);
  }
};

exports.getBudgets = async (req, res, next) => {
  try {
    const { userId } = req;
    
    const budgetsRes = await query(`
      SELECT b.id, c.name as category, b.limit_amount as limit,
             COALESCE((SELECT SUM(amount) FROM transactions WHERE category_id = c.id AND type = 'expense' AND user_id = $1), 0) as spent
      FROM budgets b
      JOIN categories c ON b.category_id = c.id
      WHERE b.user_id = $1
    `, [userId]);

    let totalBudget = 0;
    let totalSpent = 0;

    const budgets = budgetsRes.rows.map(row => {
      const limit = parseFloat(row.limit);
      const spent = parseFloat(row.spent);
      const remaining = limit - spent;
      const percentage = limit > 0 ? (spent / limit) * 100 : 0;
      
      let status = 'healthy';
      if (percentage >= 100) status = 'over';
      else if (percentage >= 80) status = 'approaching';

      totalBudget += limit;
      totalSpent += spent;

      return {
        id: row.id,
        category: row.category,
        limit,
        spent,
        remaining,
        percentage: parseFloat(percentage.toFixed(2)),
        status
      };
    });

    const utilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    res.json({
      summary: {
        totalBudget,
        totalSpent,
        utilization: parseFloat(utilization.toFixed(2))
      },
      budgets
    });
  } catch (err) {
    next(err);
  }
};

exports.getInsights = async (req, res, next) => {
  try {
    const { userId } = req;
    const insights = [];

    // Check budgets for approaching limit
    const budgetsRes = await query(`
      SELECT c.name as category, b.limit_amount as limit,
             COALESCE((SELECT SUM(amount) FROM transactions WHERE category_id = c.id AND type = 'expense' AND user_id = $1), 0) as spent
      FROM budgets b
      JOIN categories c ON b.category_id = c.id
      WHERE b.user_id = $1
    `, [userId]);

    budgetsRes.rows.forEach(row => {
      const limit = parseFloat(row.limit);
      const spent = parseFloat(row.spent);
      const percentage = limit > 0 ? (spent / limit) * 100 : 0;
      
      if (percentage >= 100) {
        insights.push({
          type: "destructive",
          title: `${row.category} budget exceeded`,
          description: `You have exceeded your ${row.category} budget by ${(spent - limit).toFixed(0)}.`,
          category: row.category
        });
      } else if (percentage >= 80) {
        insights.push({
          type: "warning",
          title: `${row.category} budget approaching limit`,
          description: `You have used ${percentage.toFixed(0)}% of your ${row.category} budget.`,
          category: row.category
        });
      }
    });

    if (insights.length === 0) {
      insights.push({
        type: "success",
        title: "Finances looking healthy",
        description: "All budgets are well under control this month.",
        category: "General"
      });
    }

    res.json(insights);
  } catch (err) {
    next(err);
  }
};
