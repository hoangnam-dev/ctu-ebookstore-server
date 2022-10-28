const express = require('express');
const router = express.Router();

// Import Controller
const {allOutputInfo, getOutputInfoByID, store, update} = require('../app/controllers/OutputInfoController');

router.get('/', allOutputInfo);
router.post('/', store);
router.get('/:id', getOutputInfoByID);
router.put('/:id', update);
// router.delete('/:id', destroy);

module.exports = router;
