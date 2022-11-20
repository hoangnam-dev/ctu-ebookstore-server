const express = require('express');
const router = express.Router();

// Import Controller
const {allOutputInfo, getOutputInfoByID, search, store, update, destroy, restore} = require('../app/controllers/OutputInfoController');

// Middlewares
const jwtMiddlewares = require('../app/middlewares/jwt');

router.get('/search', search);
router.get('/:id', getOutputInfoByID);
router.get('/', allOutputInfo);
router.post('/', jwtMiddlewares.managerOutputinfo, store);
router.put('/:id', jwtMiddlewares.managerOutputinfo, update);
router.delete('/:id', jwtMiddlewares.managerOutputinfo, destroy);
router.put('/restore/:id', jwtMiddlewares.managerOutputinfo, restore);

module.exports = router;
