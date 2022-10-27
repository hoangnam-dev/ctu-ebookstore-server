const express = require('express');
const router = express.Router();

// Import Controller
const {allProvince, getProvinceByID, store, update} = require('../app/controllers/ProvinceController');

router.get('/', allProvince);
router.post('/', store);
router.get('/:id', getProvinceByID);
router.put('/:id', update);
// router.delete('/:id', destroy);

module.exports = router;
