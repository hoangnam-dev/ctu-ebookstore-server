const express = require('express');
const router = express.Router();

// Import Controller
const {allInputInfo, getInputInfoByID, search, store, update, addDetail, updateDetail, deleteDetail, destroy, restore} = require('../app/controllers/InputInfoController');

router.get('/search', search);
router.get('/:id', getInputInfoByID);
router.get('/', allInputInfo);
router.post('/', store);
router.put('/:id', update);
router.post('/addDetail', addDetail);
router.post('/updateDetail', updateDetail);
router.post('/deleteDetail', deleteDetail);
router.delete('/:id', destroy);
router.put('/restore/:id', restore);

module.exports = router;
