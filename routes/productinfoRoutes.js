// 产品信息表

const express = require('express')

const router = express.Router();

const productinfoController = require('../controller/productinfoController')

// 获取所有产品信息
router.get('/getAllProdinfo',productinfoController.getAllProdinfo)

// 创建产品信息
router.post('/createProdinfo',productinfoController.createProdinfo)

// 修改产品信息
router.put('/updateProdinfo',productinfoController.updateProdinfo)

// 删除产品信息
router.delete('/deleteProdinfo',productinfoController.deleteProdinfo)

module.exports = router;