const express = require('express');
const router = express.Router();

// Import Controller
const {allOutputInfo, getOutputInfoByID, search, store, update, destroy, restore} = require('../app/controllers/OutputInfoController');

router.get('/search', search);
router.get('/:id', getOutputInfoByID);
router.get('/', allOutputInfo);
router.post('/', store);
router.put('/:id', update);
router.delete('/:id', destroy);
router.put('/restore/:id', restore);

module.exports = router;
