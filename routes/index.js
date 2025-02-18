// 路由集
const express = require('express')
const router = express.Router();
const userRouter = require("./userRoutes")
const pageinfoRouter = require("./pageinfoRoutes")

router.use(userRouter)
router.use(pageinfoRouter)

module.exports = router;