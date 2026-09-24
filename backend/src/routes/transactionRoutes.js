const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/recent', transactionController.getRecent);
router.get('/', transactionController.getAll);
router.post('/', transactionController.create);
router.put('/:id', transactionController.update);
router.delete('/:id', transactionController.delete);

const multer = require('multer');
const upload = multer();
const transactionImportController = require('../controllers/transactionImportController');

router.post('/import/preview', upload.single('file'), transactionImportController.previewImport);
router.post('/import/confirm', transactionImportController.confirmImport);

module.exports = router;
