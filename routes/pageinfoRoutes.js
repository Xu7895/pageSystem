// 仓库信息

const express = require('express')

const router = express.Router();

const pageinfoController = require('../controller/pageinfoContorller')

// 获取仓库所有信息
router.get('/getAllStore',pageinfoController.getAllStore );
// 模糊查询仓库
router.get('/getStoreByName',pageinfoController.getStoreByName );
// 创建仓库
router.post('/createStore', pageinfoController.createStore);
// 更新仓库信息
router.post('/updateStore', pageinfoController.updateStore);
// 删除仓库
router.delete('/deleteStore', pageinfoController.deleteStore);

module.exports = router;