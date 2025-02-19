const db = require('../config/db');

// 获取所有转移记录
exports.getAlltransRec = async (req, res) => {
    try {
        const [transferRecords] = await db.query('SELECT * FROM transfer_record');
        res.status(200).json({
            code: 200,
            msg: '转移记录获取成功',
            result: transferRecords
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


// 创建转移记录
exports.createtransRec = async (req, res) => {
    try {
        const { from_id, to_id } = req.body; // 获取来源ID和目标ID

        // 插入新的转移记录
        const result = await db.query(
            'INSERT INTO transfer_record (from_id, to_id) VALUES (?, ?)', 
            [from_id, to_id]
        );

        res.status(201).json({
            code: 201,
            msg: '转移记录创建成功',
            result: { id: result.insertId, from_id, to_id }
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

// 修改转移记录
exports.updatetransRec = async (req, res) => {
    try {
        const { id } = req.query; // 获取转移记录 ID
        const { from_id, to_id } = req.body; // 获取新的来源ID和目标ID

        // 检查转移记录是否存在
        const [transferRecord] = await db.query('SELECT * FROM transfer_record WHERE id = ?', [id]);
        if (transferRecord.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '转移记录未找到',
                result: {}
            });
        }

        // 准备更新字段，只有提供的字段才会更新
        const updateFields = [];
        const updateValues = [];

        if (from_id) {
            updateFields.push('from_id = ?');
            updateValues.push(from_id);
        }

        if (to_id) {
            updateFields.push('to_id = ?');
            updateValues.push(to_id);
        }

        // 如果没有需要更新的字段，返回一个提示
        if (updateFields.length === 0) {
            return res.status(400).json({
                code: 400,
                msg: '没有提供需要更新的字段',
                result: {}
            });
        }

        // 执行更新
        updateValues.push(id); // 添加 ID 到更新值的最后
        const updateQuery = `UPDATE transfer_record SET ${updateFields.join(', ')} WHERE id = ?`;
        await db.query(updateQuery, updateValues);

        res.status(200).json({
            code: 200,
            msg: '转移记录更新成功',
            result: { id, from_id, to_id }
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


// 删除转移记录
exports.deletetransRec = async (req, res) => {
    try {
        const { id } = req.query; // 获取转移记录 ID

        // 检查转移记录是否存在
        const [transferRecord] = await db.query('SELECT * FROM transfer_record WHERE id = ?', [id]);
        if (transferRecord.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '转移记录未找到',
                result: {}
            });
        }

        // 删除转移记录
        await db.query('DELETE FROM transfer_record WHERE id = ?', [id]);

        res.status(200).json({
            code: 200,
            msg: '转移记录删除成功',
            result: {}
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
