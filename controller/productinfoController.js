const db = require('../config/db');

// 获取所有产品信息
exports.getAllProdinfo = async (req, res) => {
    try {
        const [productInfo] = await db.query('SELECT * FROM product_info');
        res.status(200).json({
            code: 200,
            msg: '产品信息获取成功',
            result: productInfo
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

// 创建产品信息
exports.createProdinfo = async (req, res) => {
    try {
        const { depository_id, mname, quantity, price, type_id } = req.body; // 获取必要的字段

        // 插入新的产品信息
        const result = await db.query(
            'INSERT INTO product_info (depository_id, mname, quantity, price, type_id) VALUES (?, ?, ?, ?, ?)', 
            [depository_id, mname, quantity, price, type_id]
        );

        res.status(201).json({
            code: 201,
            msg: '产品信息创建成功',
            result: { id: result.insertId, depository_id, mname, quantity, price, type_id }
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

// 修改产品信息
exports.updateProdinfo = async (req, res) => {
    try {
        const { id } = req.query; // 获取产品信息 ID
        const { depository_id, mname, quantity, price, type_id } = req.body; // 获取新的产品信息

        // 检查产品信息是否存在
        const [product] = await db.query('SELECT * FROM product_info WHERE id = ?', [id]);
        if (product.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '产品信息未找到',
                result: {}
            });
        }

        // 准备更新字段，只有提供的字段才会更新
        const updateFields = [];
        const updateValues = [];

        if (depository_id) {
            updateFields.push('depository_id = ?');
            updateValues.push(depository_id);
        }

        if (mname) {
            updateFields.push('mname = ?');
            updateValues.push(mname);
        }

        if (quantity) {
            updateFields.push('quantity = ?');
            updateValues.push(quantity);
        }

        if (price) {
            updateFields.push('price = ?');
            updateValues.push(price);
        }

        if (type_id) {
            updateFields.push('type_id = ?');
            updateValues.push(type_id);
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
        const updateQuery = `UPDATE product_info SET ${updateFields.join(', ')} WHERE id = ?`;
        await db.query(updateQuery, updateValues);

        res.status(200).json({
            code: 200,
            msg: '产品信息更新成功',
            result: { id, depository_id, mname, quantity, price, type_id }
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

// 删除产品信息
exports.deleteProdinfo = async (req, res) => {
    try {
        const { id } = req.query; // 获取产品信息 ID

        // 检查产品信息是否存在
        const [product] = await db.query('SELECT * FROM product_info WHERE id = ?', [id]);
        if (product.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '产品信息未找到',
                result: {}
            });
        }

        // 删除产品信息
        await db.query('DELETE FROM product_info WHERE id = ?', [id]);

        res.status(200).json({
            code: 200,
            msg: '产品信息删除成功',
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

