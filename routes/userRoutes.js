const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/all', userController.getAllUsers);
router.get('/getBy/:id', userController.getUserById);
router.post('/ins', userController.createUser);
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);


module.exports = router;

