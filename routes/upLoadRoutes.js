const express = require('express')

const router = express.Router();

const upLoadController = require('../controller/upLoadController')

// 单个图片上传
router.post('/uploadImage', upLoadController.uploadImage);

// 多个图片上传
router.post('/uploadMultipleImages', upLoadController.uploadMultipleImages);

module.exports = router;