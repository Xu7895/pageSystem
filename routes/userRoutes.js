// 用户登录

const express = require('express')

const router = express.Router();

const userController = require('../controller/userController')

// 用户登录
router.post('/login',userController.login );

// 用户注册
router.post('/register', userController.register);

// 获取用户信息
router.get('/getAllUserIdName', userController.getAllUserIdName);

// 修改密码
router.post('/updatePassword', userController.updatePassword);

// 获取用户信息(除了密码)
router.post('/getUserInfo', userController.getUserInfo);

// 获取所有用户信息（除了密码）
router.get('/getAllUsers', userController.getAllUsers);

// 修改用户信息（除了密码）
router.post('/updateUserInfo', userController.updateUserInfo);

// 修改用户部分信息（姓名，性别，手机，邮箱）
router.post('/updateBasicUserInfo', userController.updateBasicUserInfo);

// 修改用户权限 负责仓库
router.post('/updateUserPower', userController.updateUserPower);


module.exports = router;