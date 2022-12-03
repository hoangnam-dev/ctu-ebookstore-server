const express = require('express');
const router = express.Router();

// Import Controller
const {allLicense, getLicenseByID, search, store, destroy} = require('../app/controllers/LicenseController');

router.get('/search', search);
router.get('/:id', getLicenseByID);
router.get('/', allLicense);
router.post('/', store);
router.delete('/:id', destroy);

module.exports = router;
