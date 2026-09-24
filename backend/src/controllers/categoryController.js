const { query } = require('../db');

exports.getCategories = async (req, res) => {
  try {
    const result = await query(
      `SELECT c.*, COUNT(t.id) as transaction_count 
       FROM categories c 
       LEFT JOIN transactions t ON c.id = t.category_id 
       WHERE c.user_id = $1 
       GROUP BY c.id 
       ORDER BY c.type, c.name`,
      [req.userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, type, color, icon } = req.body;
    if (!name || !type) {
      return res.status(400).json({ success: false, message: 'Name and type are required' });
    }

    const result = await query(
      'INSERT INTO categories (user_id, name, type, color, icon) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.userId, name, type, color || '#3b82f6', icon || 'tag']
    );
    
    // Add transaction count 0 so the frontend has consistent data
    const newCategory = { ...result.rows[0], transaction_count: '0' };
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, color, icon } = req.body;
    
    // Check if category belongs to user
    const checkRes = await query('SELECT id FROM categories WHERE id = $1 AND user_id = $2', [id, req.userId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const result = await query(
      'UPDATE categories SET name = $1, type = $2, color = $3, icon = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 AND user_id = $6 RETURNING *',
      [name, type, color || '#3b82f6', icon || 'tag', id, req.userId]
    );
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category belongs to user
    const checkRes = await query('SELECT id FROM categories WHERE id = $1 AND user_id = $2', [id, req.userId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Block if there are transactions using this category
    const transCheck = await query('SELECT COUNT(*) as count FROM transactions WHERE category_id = $1 AND user_id = $2', [id, req.userId]);
    if (parseInt(transCheck.rows[0].count) > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete category because it is used by existing transactions.' });
    }

    await query('DELETE FROM categories WHERE id = $1 AND user_id = $2', [id, req.userId]);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
