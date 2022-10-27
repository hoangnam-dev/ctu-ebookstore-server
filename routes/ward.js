const express = require('express');
const router = express.Router();

// Import Controller
const {allWard, getWardByID, store, update} = require('../app/controllers/WardController');

router.get('/', allWard);
router.post('/', store);
router.get('/:id', getWardByID);
router.put('/:id', update);
// router.delete('/:id', destroy);

module.exports = router;
