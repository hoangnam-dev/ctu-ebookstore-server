const express = require('express');
const router = express.Router();

// Import Controller
const {allLicense, getLicenseByID, store, update} = require('../app/controllers/LicenseController');

router.get('/', allLicense);
router.post('/', store);
router.get('/:id', getLicenseByID);
router.put('/:id', update);
// router.delete('/:id', destroy);

module.exports = router;
