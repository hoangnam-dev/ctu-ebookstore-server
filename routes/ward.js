const express = require('express');
const router = express.Router();

// Import Controller
const {allWard, getWardByID, getWardByDistrictID, store, update} = require('../app/controllers/WardController');

router.get('/', allWard);
router.post('/', store);
router.get('/:id', getWardByID);
router.post('/getWards', getWardByDistrictID);
router.put('/:id', update);
// router.delete('/:id', destroy);

module.exports = router;
