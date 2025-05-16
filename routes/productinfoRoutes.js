// 物品信息表

const express = require('express')
const router = express.Router();
const productinfoController = require('../controller/productinfoController')

// 获取所有物品信息
router.get('/getAllProdinfo',productinfoController.getAllProdinfo)

// 创建物品信息
router.post('/createProdinfo',productinfoController.createProdinfo)

// 修改物品信息
router.put('/updateProdinfo',productinfoController.updateProdinfo)

// 删除物品信息
router.delete('/deleteProdinfo',productinfoController.deleteProdinfo)

// 根据名称查询物品信息
router.post('/getProdinfoByName',productinfoController.getProdinfoByName)

// 预出库信息添加
router.post('/updateCqOutinfo',productinfoController.updateCqOutinfo)

// 预出库信息修改
router.post('/updateQtyOutinfo',productinfoController.updateQtyOutinfo)

// 预出库撤回
router.post('/recallQtyOutinfo',productinfoController.recallQtyOutinfo)

module.exports = router;