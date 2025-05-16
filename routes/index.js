// 路由集
const express = require('express')
const router = express.Router();
const userRouter = require("./userRoutes")
const pageinfoRouter = require("./pageinfoRoutes")
const noticeRouter = require('./noticeRoutes')
const matTypeRouter = require('./matTypeRoutes')
const transRecRouter = require('./transRecRoutes')
const productinfoRouter = require('./productinfoRoutes')
const pageRecRouter = require('./pageRecRoutes')
const upLoadRouter = require('./upLoadRoutes')

router.use(userRouter)
router.use(pageinfoRouter)
router.use(noticeRouter)
router.use(matTypeRouter)
router.use(transRecRouter)
router.use(productinfoRouter)
router.use(pageRecRouter)
router.use(upLoadRouter)

module.exports = router;