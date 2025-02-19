// 路由集
const express = require('express')
const router = express.Router();
const userRouter = require("./userRoutes")
const pageinfoRouter = require("./pageinfoRoutes")
const noticeRouter = require('./noticeRoutes')
const matTypeRouter = require('./matTypeRoutes')
const transRecRouter = require('./transRecRoutes')

router.use(userRouter)
router.use(pageinfoRouter)
router.use(noticeRouter)
router.use(matTypeRouter)
router.use(transRecRouter)

module.exports = router;