const express = require('express');
const router = express.Router();

// Import Controller
const {allInputInfo, getInputInfoByID, search, store, update, addDetail, updateDetail, deleteDetail, destroy, restore} = require('../app/controllers/InputInfoController');

// Middlewares
const jwtMiddlewares = require('../app/middlewares/jwt');

router.get('/search', search);
router.get('/:id', getInputInfoByID);
router.get('/', allInputInfo);
router.post('/', jwtMiddlewares.managerInputinfo, store);
router.put('/:id', jwtMiddlewares.managerInputinfo, update);
router.post('/addDetail', jwtMiddlewares.managerInputinfo, addDetail);
router.post('/updateDetail', jwtMiddlewares.managerInputinfo, updateDetail);
router.post('/deleteDetail', jwtMiddlewares.managerInputinfo, deleteDetail);
router.delete('/:id', jwtMiddlewares.managerInputinfo, destroy);
router.put('/restore/:id', jwtMiddlewares.managerInputinfo, restore);

module.exports = router;
