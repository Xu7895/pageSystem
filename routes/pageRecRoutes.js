// 页面记录表

const express = require('express')

const router = express.Router();

const pageRecController = require('../controller/pageRecController')

// 获取所有页面记录
router.get('/getAllpageRec',pageRecController.getAllpageRec)

// 获取入库页面记录
router.get('/getPutpageRec',pageRecController.getPutpageRec)

// 获取出库页面记录
router.get('/getOutpageRec',pageRecController.getOutpageRec)

// 根据depositoryId获取记录
router.post('/getPageRecBydepositoryId',pageRecController.getPageRecBydepositoryId)

// 根据applicant_id获取记录
router.post('/getPageRecByApplicantId',pageRecController.getPageRecByApplicantId)

// 创建(出入库)页面记录
router.post('/createpageRec',pageRecController.createpageRec)

// 审核修改页面记录
router.put('/updatepageRec',pageRecController.updatepageRec)

// 删除页面记录
router.delete('/deletepageRec',pageRecController.deletepageRec)

// 获取仓库数量，物品总数，入库，出库记录总数
router.get('/getPgCount',pageRecController.getPgCount)


module.exports = router;