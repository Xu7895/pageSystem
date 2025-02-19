// 路由集
const express = require('express')
const router = express.Router();
const userRouter = require("./userRoutes")
const pageinfoRouter = require("./pageinfoRoutes")
const noticeRouter = require('./noticeRoutes')

router.use(userRouter)
router.use(pageinfoRouter)
router.use(noticeRouter)

module.exports = router;