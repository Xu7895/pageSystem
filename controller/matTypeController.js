const db = require('../config/db');

// 获取所有材料类型
exports.getAllMatType = async (req, res) => {
    try {
        const [matTypes] = await db.query('SELECT * FROM material_type');
        res.status(200).json({
            code: 200,
            msg: '材料类型获取成功',
            result: matTypes
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


// 创建材料类型
exports.creatematType = async (req, res) => {
    try {
        const { tname, introduce } = req.body; 

        // 检查是否已有相同名称的材料类型
        const [existingType] = await db.query('SELECT * FROM material_type WHERE tname = ?', [tname]);
        if (existingType.length > 0) {
            return res.status(400).json({
                code: 400,
                msg: '该材料类型名称已存在',
                result: {}
            });
        }
        console.log('继续执行');
        
        // 插入新材料类型
        const result = await db.query(
            'INSERT INTO material_type (tname, introduce) VALUES (?, ?)', 
            [tname, introduce]
        );

        res.status(200).json({
            code: 200,
            msg: '材料类型创建成功',
            result: { id: result.insertId, tname, introduce }
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




// 修改材料类型
exports.updatematType = async (req, res) => {
    try {
        const { id, tname, introduce } = req.body; // 获取新的名称和介绍

        // 检查材料类型是否存在
        const [matType] = await db.query('SELECT * FROM material_type WHERE id = ?', [id]);
        if (matType.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '材料类型未找到',
                result: {}
            });
        }

        // 更新材料类型
        await db.query(
            'UPDATE material_type SET tname = ?, introduce = ? WHERE id = ?', 
            [tname, introduce, id]
        );

        res.status(200).json({
            code: 200,
            msg: '材料类型更新成功',
            result: { id, tname, introduce }
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



// 删除材料类型
exports.deletematType = async (req, res) => {
    try {
        const { id } = req.body; // 获取材料类型 ID
        console.log(id);
        
        // 检查材料类型是否存在
        const [matType] = await db.query('SELECT * FROM material_type WHERE id = ?', [id]);
        if (matType.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '材料类型未找到',
                result: {}
            });
        }

        // 获取材料类型的名称
        const { tname } = matType[0];

        // 删除材料类型
        await db.query('DELETE FROM material_type WHERE id = ?', [id]);

        res.status(200).json({
            code: 200,
            msg: '材料类型删除成功',
            result: { tname } // 返回删除的材料类型名称
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

