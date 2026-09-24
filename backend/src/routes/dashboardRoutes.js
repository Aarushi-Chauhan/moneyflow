const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/summary', dashboardController.getSummary);
router.get('/cash-flow', dashboardController.getCashFlow);
router.get('/spending', dashboardController.getSpending);
router.get('/budgets', dashboardController.getBudgets);
router.get('/insights', dashboardController.getInsights);

module.exports = router;
