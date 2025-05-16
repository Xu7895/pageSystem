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
        const { title, content, state = '0' } = req.body; // 从请求体获取公告的标题和内容，默认为草稿状态
        const time = new Date(); // 获取当前时间

        // 插入新公告
        const result = await db.query(
            'INSERT INTO notice (title, content, state ,time) VALUES (?, ?, ?, ?)',
            [title, content, state ,time]
        );

        res.status(200).json({
            code: 200,
            msg: '公告创建成功',
            result: { id: result.insertId, title, state, content, time }
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
        const { id, title, content } = req.body; // 获取新的标题、内容和状态

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
        const currentTime = new Date();
        await db.query(
            'UPDATE notice SET title = ?, content = ?, time = ? WHERE id = ?',
            [title, content, currentTime, id]
        );

        res.status(200).json({
            code: 200,
            msg: '公告更新成功',
            result: { id, title, content, time: currentTime }
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


// 删除公告（支持批量删除）
exports.deleteNotice = async (req, res) => {
    try {
        const { ids } = req.body; // 获取公告ID数组
        const idArray = Array.isArray(ids) ? ids : [ids]; // 确保ids是数组
        
        // 检查公告是否存在
        const [notices] = await db.query('SELECT * FROM notice WHERE id IN (?)', [idArray]);
        if (notices.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '未找到任何公告',
                result: {}
            });
        }

        // 获取所有要删除的公告标题
        const titles = notices.map(notice => notice.title);

        // 批量删除公告
        await db.query('DELETE FROM notice WHERE id IN (?)', [idArray]);

        res.status(200).json({
            code: 200,
            msg: `成功删除${notices.length}条公告`,
            result: { 
                deletedCount: notices.length,
                titles: titles
            }
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


// 更新公告状态
exports.updateNoticeState = async (req, res) => {
    try {
        const {id, state } = req.body; // 获取新的状态值

        // 检查公告是否存在
        const [notice] = await db.query('SELECT * FROM notice WHERE id = ?', [id]);
        if (notice.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '公告未找到',
                result: {}
            });
        }

        // 更新公告状态
        await db.query(
            'UPDATE notice SET state = ? WHERE id = ?',
            [state, id]
        );

        res.status(200).json({
            code: 200,
            msg: '公告状态更新成功',
            result: { id, state }
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
