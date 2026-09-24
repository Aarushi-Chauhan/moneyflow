const { query } = require('../db');

exports.setupAccount = async (req, res, next) => {
  try {
    const { userId } = req;
    const { balance, income, categories } = req.body;

    // Check if already setup
    const prefsRes = await query('SELECT setup_completed FROM user_preferences WHERE user_id = $1', [userId]);
    if (prefsRes.rows.length > 0 && prefsRes.rows[0].setup_completed) {
      return res.status(400).json({ success: false, message: 'Account is already set up' });
    }

    // Default Categories to Seed
    const defaultExpenses = [
      "Food & Dining", "Shopping", "Transportation", "Bills & Utilities", 
      "Health & Medical", "Entertainment", "Fitness & Sports", "Travel", 
      "Education", "Other"
    ];
    
    const defaultIncomes = [
      "Salary", "Freelance", "Bonus", "Investment Returns", "Other Income"
    ];

    const categoryMap = {};

    // Insert Expenses
    for (const cat of defaultExpenses) {
      const res = await query(
        "INSERT INTO categories (user_id, name, type) VALUES ($1, $2, $3) RETURNING id, name",
        [userId, cat, 'expense']
      );
      categoryMap[res.rows[0].name] = res.rows[0].id;
    }

    // Insert Incomes
    for (const cat of defaultIncomes) {
      const res = await query(
        "INSERT INTO categories (user_id, name, type) VALUES ($1, $2, $3) RETURNING id, name",
        [userId, cat, 'income']
      );
      categoryMap[res.rows[0].name] = res.rows[0].id;
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Save starting balance in user_preferences instead of creating a transaction
    // We will update it in the final query below

    if (income > 0) {
      // Determine the next occurrence date
      let nextDate = new Date();
      if (req.body.payDate) {
        // Assume payDate is a day of the month (1-31)
        let targetDay = parseInt(req.body.payDate, 10);
        if (isNaN(targetDay)) targetDay = 1;
        
        // If the target day has already passed this month, schedule for next month
        if (nextDate.getDate() >= targetDay) {
          nextDate.setMonth(nextDate.getMonth() + 1);
        }
        
        // Handle edge cases like Feb 30th -> Feb 28/29
        const lastDayOfTargetMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
        nextDate.setDate(Math.min(targetDay, lastDayOfTargetMonth));
      } else {
        // Default to exactly one month from today
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      
      const nextOccurrenceStr = nextDate.toISOString().split('T')[0];

      await query(
        `INSERT INTO recurring_income (user_id, name, amount, category_id, frequency, start_date, next_occurrence) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [userId, 'Monthly Salary', income, categoryMap['Salary'], 'monthly', today, nextOccurrenceStr]
      );
    }

    // Mark setup as completed, set currency, and save starting balance
    await query(`
      UPDATE user_preferences 
      SET setup_completed = true, currency = 'INR', starting_balance = $2, updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = $1
    `, [userId, balance || 0]);

    res.json({ success: true, message: 'Account setup completed successfully' });
  } catch (err) {
    next(err);
  }
};
