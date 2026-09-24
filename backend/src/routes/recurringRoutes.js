const express = require('express');
const router = express.Router();
const recurringController = require('../controllers/recurringController');

router.get('/', recurringController.getRecurringIncomes);
router.post('/', recurringController.createRecurringIncome);
router.put('/:id', recurringController.updateRecurringIncome);
router.delete('/:id', recurringController.deleteRecurringIncome);

module.exports = router;
