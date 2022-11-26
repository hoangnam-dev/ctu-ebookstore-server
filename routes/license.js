const express = require('express');
const router = express.Router();

// Import Controller
const {allLicense, getLicenseByID, store, destroy} = require('../app/controllers/LicenseController');

router.get('/', allLicense);
router.post('/', store);
router.get('/:id', getLicenseByID);
router.delete('/:id', destroy);

module.exports = router;
