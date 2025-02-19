const db = require('../config/db');

// 获取所有公告
exports.getAllNotice = async (req, res) => {
    try {
        const [notices] = await db.query('SELECT * FROM notice ORDER BY time DESC');      
        res.status(200).json({
            code: 200,
            msg: '公告获取成功',
            result: notices
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            msg: '服务器内部错误',
            result: {}
        });
    }
};


// 创建公告
exports.createNotice = async (req, res) => {
    try {
        const { title, content } = req.body; // 从请求体获取公告的标题和内容
        const time = new Date(); // 获取当前时间

        // 插入新公告
        const result = await db.query(
            'INSERT INTO notice (title, content, time) VALUES (?, ?, ?)', 
            [title, content, time]
        );

        res.status(200).json({
            code: 200,
            msg: '公告创建成功',
            result: { id: result.insertId, title, content, time }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            msg: '服务器内部错误',
            result: {}
        });
    }
};


// 更新公告
exports.updateNotice = async (req, res) => {
    try {
        const { id } = req.query; // 获取公告 ID
        const { title, content } = req.body; // 获取新的标题和内容

        // 检查公告是否存在
        const [notice] = await db.query('SELECT * FROM notice WHERE id = ?', [id]);
        if (notice.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '公告未找到',
                result: {}
            });
        }

        // 更新公告
        await db.query(
            'UPDATE notice SET title = ?, content = ? WHERE id = ?', 
            [title, content, id]
        );

        res.status(200).json({
            code: 200,
            msg: '公告更新成功',
            result: { id, title, content }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            msg: '服务器内部错误',
            result: {}
        });
    }
};


// 删除公告
exports.deleteNotice = async (req, res) => {
    try {
        const { id } = req.query; // 获取公告 ID

        // 检查公告是否存在
        const [notice] = await db.query('SELECT * FROM notice WHERE id = ?', [id]);
        if (notice.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '公告未找到',
                result: {}
            });
        }

        // 删除公告
        const { title } = notice[0];
        await db.query('DELETE FROM notice WHERE id = ?', [id]);

        res.status(200).json({
            code: 200,
            msg: '公告删除成功',
            result: {title}
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            msg: '服务器内部错误',
            result: {}
        });
    }
};
