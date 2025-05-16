const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config();


const routes = require('./routes/index');

const app = express()

app.use(cors());
app.use(bodyParser.json())
// 配置静态文件服务，使前端可以访问上传的图片
app.use('/api/upload/img', express.static('upload/img'));
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log(`服务器运行在端口${PORT}`))
