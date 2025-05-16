// 公告表

const express = require('express')
const router = express.Router();
const noticeController = require('../controller/noticeController')

// 获取所有公告
router.get('/getAllNotice',noticeController.getAllNotice)

// 创建公告
router.post('/createNotice',noticeController.createNotice)

// 更新公告
router.put('/updateNotice',noticeController.updateNotice)

// 删除公告
router.delete('/deleteNotice',noticeController.deleteNotice)

// 更新公告状态
router.put('/updateNoticeState',noticeController.updateNoticeState)

module.exports = router;