const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

router.get('/users', exportController.getExportUsers);
router.get('/classes', exportController.getExportClasses);
router.get('/stats', exportController.getExportStats);

module.exports = router;
