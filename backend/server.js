require('dotenv').config();
const app = require('./src/app');

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MoneyFlow API is running'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
