// 转移记录表

const express = require('express')

const router = express.Router();

const transRecController = require('../controller/transRecController')

// 获取所有转移记录
router.get('/getAlltransRec',transRecController.getAlltransRec)

// 创建材料类型
router.post('/createtransRec',transRecController.createtransRec)

// 修改材料类型
router.put('/updatetransRec',transRecController.updatetransRec)

// 删除材料类型
router.delete('/deletetransRec',transRecController.deletetransRec)

module.exports = router;