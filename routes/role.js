const express = require('express');
const router = express.Router();

// Import Controller
const {allRole, getRoleByID, store, update} = require('../app/controllers/RoleController');

router.get('/', allRole);
router.post('/', store);
router.get('/:id', getRoleByID);
router.put('/:id', update);
// router.delete('/:id', destroy);

module.exports = router;
