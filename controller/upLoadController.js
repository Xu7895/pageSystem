const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 配置存储引擎
const storage = multer.diskStorage({
    // 设置文件存储目标位置
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../upload/img');
        
        // 确保目录存在，如果不存在则创建
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    // 设置文件名
    filename: function (req, file, cb) {
        // 生成唯一文件名，避免文件名冲突
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// 文件过滤器，限制文件类型
const fileFilter = (req, file, cb) => {
    // 允许的文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('不支持的文件类型，只允许上传 JPG, PNG, GIF 和 WEBP 格式的图片'), false);
    }
};

// 配置上传中间件
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 限制文件大小为5MB
    }
});

// 处理单个文件上传
exports.uploadImage = (req, res) => {
    // 使用单文件上传中间件
    const uploadSingle = upload.single('image');
    
    uploadSingle(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Multer错误处理
            return res.status(400).json({
                code: 400,
                msg: '文件上传失败: ' + err.message,
                result: {}
            });
        } else if (err) {
            // 其他错误处理
            return res.status(400).json({
                code: 400,
                msg: err.message,
                result: {}
            });
        }
        
        // 文件上传成功
        if (!req.file) {
            return res.status(400).json({
                code: 400,
                msg: '请选择要上传的图片',
                result: {}
            });
        }
        
        // 构建文件访问路径
        const filePath = `/api/upload/img/${req.file.filename}`;
        console.log(filePath);
        
        // 返回成功响应
        res.status(200).json({
            code: 200,
            msg: '图片上传成功',
            result: {
                filePath: filePath,
                originalName: req.file.originalname,
                size: req.file.size
            }
        });
    });
};

// 处理多个文件上传
exports.uploadMultipleImages = (req, res) => {
    // 使用多文件上传中间件，最多允许上传5个文件
    const uploadMultiple = upload.array('images', 5);
    
    uploadMultiple(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Multer错误处理
            return res.status(400).json({
                code: 400,
                msg: '文件上传失败: ' + err.message,
                result: {}
            });
        } else if (err) {
            // 其他错误处理
            return res.status(400).json({
                code: 400,
                msg: err.message,
                result: {}
            });
        }
        
        // 文件上传成功
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                code: 400,
                msg: '请选择要上传的图片',
                result: {}
            });
        }
        
        // 构建文件访问路径
        const fileInfos = req.files.map(file => ({
            filePath: `/api/upload/img/${file.filename}`,
            originalName: file.originalname,
            size: file.size
        }));
        
        // 返回成功响应
        res.status(200).json({
            code: 200,
            msg: '图片上传成功',
            result: fileInfos
        });
    });
};