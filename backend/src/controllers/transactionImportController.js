const { query } = require('../db');
const { parse } = require('csv-parse/sync');

const VALID_PAYMENT_METHODS = ["UPI", "Cash", "Debit Card", "Credit Card", "Bank Transfer", "Net Banking", "Other"];

exports.previewImport = async (req, res, next) => {
  try {
    const { userId } = req;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a CSV file.' });
    }

    const fileContent = req.file.buffer.toString('utf8');
    let records;
    try {
      records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Invalid CSV format. Please check your file.' });
    }

    if (records.length === 0) {
      return res.status(400).json({ success: false, message: 'The uploaded CSV file is empty.' });
    }

    // Fetch user categories
    const categoriesRes = await query(`SELECT id, name, type FROM categories WHERE user_id = $1`, [userId]);
    const categories = categoriesRes.rows;
    
    // Normalize category mapping
    const categoryMap = {}; // key: "type:name", value: id
    categories.forEach(c => {
      categoryMap[`${c.type.toLowerCase()}:${c.name.toLowerCase()}`] = c.id;
    });

    const previewRows = [];
    let validCount = 0;
    let invalidCount = 0;

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const errors = [];
      let parsedAmount = 0;
      let parsedDate = null;
      let normalizedType = '';
      let categoryId = null;
      let paymentMethod = '';

      // 1. Type
      if (!row.Type) {
        errors.push("Type is required");
      } else {
        const typeStr = row.Type.trim().toLowerCase();
        if (typeStr === 'income' || typeStr === 'expense') {
          normalizedType = typeStr;
        } else {
          errors.push(`Invalid type "${row.Type}". Must be Income or Expense.`);
        }
      }

      // 2. Date
      if (!row.Date) {
        errors.push("Date is required");
      } else {
        // Handle DD-MM-YYYY
        const dateParts = row.Date.split('-');
        if (dateParts.length === 3) {
          const [d, m, y] = dateParts;
          const dateObj = new Date(`${y}-${m}-${d}`);
          if (isNaN(dateObj.getTime())) {
            errors.push("Invalid date format. Expected DD-MM-YYYY");
          } else {
            parsedDate = `${y}-${m}-${d}`;
          }
        } else {
          errors.push("Invalid date format. Expected DD-MM-YYYY");
        }
      }

      // 3. Amount
      if (!row.Amount) {
        errors.push("Amount is required");
      } else {
        parsedAmount = parseFloat(row.Amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
          errors.push("Amount must be a numeric value greater than 0");
        }
      }

      // 4. Title/Merchant
      const title = row.Title ? row.Title.trim() : '';
      if (!title) {
        errors.push("Title is required");
      }

      // 5. Category
      if (!row.Category) {
        errors.push("Category is required");
      } else if (normalizedType) {
        const catKey = `${normalizedType}:${row.Category.trim().toLowerCase()}`;
        if (categoryMap[catKey]) {
          categoryId = categoryMap[catKey];
        } else {
          errors.push(`Category "${row.Category}" does not exist for type ${normalizedType}.`);
        }
      }

      // 6. Payment Method
      if (!row['Payment Method']) {
        errors.push("Payment Method is required");
      } else {
        const pmRaw = row['Payment Method'].trim().toLowerCase();
        const matched = VALID_PAYMENT_METHODS.find(m => m.toLowerCase() === pmRaw);
        if (matched) {
          paymentMethod = matched;
        } else {
          errors.push(`Unsupported payment method "${row['Payment Method']}".`);
        }
      }
      
      const notes = row.Notes ? row.Notes.trim() : null;

      const isValid = errors.length === 0;
      if (isValid) validCount++;
      else invalidCount++;

      previewRows.push({
        rowNumber: i + 1,
        original: row,
        parsed: isValid ? {
          type: normalizedType,
          date: parsedDate,
          amount: parsedAmount,
          merchant: title,
          categoryId: categoryId,
          paymentMethod: paymentMethod,
          notes: notes
        } : null,
        isValid,
        errors
      });
    }

    res.json({
      success: true,
      data: {
        totalRows: records.length,
        validCount,
        invalidCount,
        previewRows
      }
    });

  } catch (err) {
    next(err);
  }
};

exports.confirmImport = async (req, res, next) => {
  try {
    const { userId } = req;
    const { validRows } = req.body;

    if (!validRows || !Array.isArray(validRows) || validRows.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid rows to import.' });
    }

    let insertedCount = 0;
    
    // Ensure we start a transaction
    await query('BEGIN');
    
    try {
      for (const row of validRows) {
        // Prevent exact duplicates: Check if same transaction exists
        const dupCheck = await query(`
          SELECT id FROM transactions 
          WHERE user_id = $1 AND transaction_date = $2 AND amount = $3 AND type = $4 AND merchant = $5
        `, [userId, row.date, row.amount, row.type, row.merchant]);

        if (dupCheck.rows.length === 0) {
          await query(`
            INSERT INTO transactions (user_id, merchant, amount, type, category_id, payment_method, transaction_date, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [userId, row.merchant, row.amount, row.type, row.categoryId, row.paymentMethod, row.notes]);
          insertedCount++;
        }
      }
      
      await query('COMMIT');
    } catch (e) {
      await query('ROLLBACK');
      throw e;
    }

    res.json({ success: true, data: { insertedCount } });
  } catch (err) {
    next(err);
  }
};
