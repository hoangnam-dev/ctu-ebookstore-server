const express = require('express');
const router = express.Router();

// Import Controller
const {allInputInfo, getInputInfoByID, store, update} = require('../app/controllers/InputInfoController');

router.get('/', allInputInfo);
router.post('/', store);
router.get('/:id', getInputInfoByID);
router.put('/:id', update);
// router.delete('/:id', destroy);

module.exports = router;
