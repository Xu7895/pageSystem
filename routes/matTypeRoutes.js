// 材料类型表

const express = require('express')

const router = express.Router();

const matTypeController = require('../controller/matTypeController')

// 获取所有材料类型
router.get('/getAllmatType',matTypeController.getAllMatType)

// 创建材料类型
router.post('/creatematType',matTypeController.creatematType)

// 修改材料类型
router.put('/updatematType',matTypeController.updatematType)

// 删除材料类型
router.delete('/deletematType',matTypeController.deletematType)

module.exports = router;