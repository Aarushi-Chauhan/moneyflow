CREATE TABLE IF NOT EXISTS recurring_income (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    frequency VARCHAR(50) DEFAULT 'monthly',
    start_date DATE NOT NULL,
    next_occurrence DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS recurring_income_id INTEGER REFERENCES recurring_income(id) ON DELETE SET NULL;
