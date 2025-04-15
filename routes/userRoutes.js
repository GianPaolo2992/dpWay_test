const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/all', userController.getAllUsers);
router.get('/allWithRole', userController.getAllUsersWithRole);
router.get('/getBy/:id', userController.getUserById);
router.post('/ins', userController.createUser);
router.put('/update/:id/alluser', userController.updateUser);//non implementata
router.put('/user/:id/username', userController.updateUsername);
router.put('/user/:id/email', userController.updateEmail);
router.put('/user/:id/password', userController.updatePassword);
router.delete('/delete/:id', userController.deleteUser);


module.exports = router;

