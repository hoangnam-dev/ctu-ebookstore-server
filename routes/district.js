const express = require('express');
const router = express.Router();

// Import Controller
const {allDistrict, getDistrictByID, store, update} = require('../app/controllers/DistrictController');

router.get('/', allDistrict);
router.post('/', store);
router.get('/:id', getDistrictByID);
router.put('/:id', update);
// router.delete('/:id', destroy);

module.exports = router;
