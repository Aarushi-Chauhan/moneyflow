const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.get('/profile', accountController.getProfile);
router.put('/profile', accountController.updateProfile);

router.get('/preferences', accountController.getPreferences);
router.put('/preferences', accountController.updatePreferences);

router.get('/notification-preferences', accountController.getNotificationPreferences);
router.put('/notification-preferences', accountController.updateNotificationPreferences);

router.get('/financial-profile', accountController.getFinancialProfile);
router.put('/financial-profile', accountController.updateFinancialProfile);

router.get('/ai-preferences', accountController.getAiPreferences);
router.put('/ai-preferences', accountController.updateAiPreferences);

router.put('/password', accountController.changePassword);

const setupController = require('../controllers/setupController');
router.post('/setup', setupController.setupAccount);

module.exports = router;
