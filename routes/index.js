// 路由集
const express = require('express')
const router = express.Router();
const userRouter = require("./userRoutes")

router.use(userRouter)

module.exports = router;