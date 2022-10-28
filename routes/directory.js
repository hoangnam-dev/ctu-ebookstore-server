const express = require('express');
const router = express.Router();

// Import Controller
// const {allDirectory, getDirectoryByID, store, update, destroy} = require('../app/controllers/DiretoryConotroller');
const {allDirectory, store, getDirectoryByID, update} = require('../app/controllers/DiretoryController');

router.get('/', allDirectory);
router.post('/', store);
router.get('/:id', getDirectoryByID);
router.put('/:id', update);
// router.delete('/:id', destroy);

module.exports = router;
