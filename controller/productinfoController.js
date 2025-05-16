const db = require('../config/db');

// 获取所有物品信息
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
        const { img_url, depository_id, mname, quantity, price, type_id} = req.body;

        // 插入新的物品信息
        const result = await db.query(
            'INSERT INTO product_info (img_url, depository_id, mname, quantity, price, type_id) VALUES (?, ?, ?, ?, ?, ?)', 
            [img_url, depository_id, mname, quantity, price, type_id]
        );
        res.status(200).json({
            code: 200,
            msg: '产品信息创建成功',
            result: { id: result.insertId, img_url, depository_id, mname, quantity, price, type_id }
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
        const { id, img_url, depository_id, mname, quantity, price, type_id, co_qty } = req.body; // 获取新的产品信息

        // 检查物品信息是否存在
        const [product] = await db.query('SELECT * FROM product_info WHERE id = ?', [id]);
        if (product.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '产品信息未找到',
                result: {}
            });
        }

        // 只有提供的字段才会更新
        const updateFields = [];
        const updateValues = [];

        if (img_url) {
            updateFields.push('img_url = ?');
            updateValues.push(img_url);
        }

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
            updateValues.push(Number(quantity));
        }

        if (price !== undefined) {
            updateFields.push('price = ?');
            updateValues.push(Number(price));
        }

        if (co_qty !== undefined) {
            updateFields.push('co_qty = ?');
            updateValues.push(Number(co_qty));
        }

        if (type_id) {
            updateFields.push('type_id = ?');
            updateValues.push(type_id);
        }

        // 没有需要更新的字段，返回提示
        if (updateFields.length === 0) {
            return res.status(400).json({
                code: 400,
                msg: '没有提供需要更新的字段',
                result: {}
            });
        }

        updateValues.push(id); 
        const updateQuery = `UPDATE product_info SET ${updateFields.join(', ')} WHERE id = ?`;
        await db.query(updateQuery, updateValues);

        res.status(200).json({
            code: 200,
            msg: '物品信息更新成功',
            result: { id, depository_id, mname, quantity, price, type_id, co_qty }
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

// 删除物品信息
exports.deleteProdinfo = async (req, res) => {
    try {
        const { id } = req.body; 
        const [product] = await db.query('SELECT * FROM product_info WHERE id = ?', [id]);
        if (product.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '产品信息未找到',
                result: {}
            });
        }

        // 删除物品信息
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

// 根据物品名称查询物品信息
exports.getProdinfoByName = async (req, res) => {
    try {
        const {id, mname } = req.body; 
        if (!mname) {
            return res.status(400).json({
                code: 400,
                msg: '产品名称不能为空',
                result: {}
            });
        }
        const [products] = await db.query('SELECT * FROM product_info WHERE mname = ? AND id = ?', [mname, Number(id)]);
    
        if (products.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '没有找到匹配的产品',
                result: []
            });
        }
        res.status(200).json({
            code: 200,
            msg: '产品信息查询成功',
            result: products
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

// 预出库信息添加
exports.updateCqOutinfo = async (req, res) => {
    try {
        const { id, co_qty } = req.body; 
        const [product] = await db.query('SELECT * FROM product_info WHERE id = ?', [id]);
        if (product.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '产品不存在',
                result: {}
            });
        }
        
        const newCoQty = (product[0].co_qty || 0) + Number(co_qty);
        await db.query('UPDATE product_info SET co_qty = ? WHERE id = ?', [newCoQty, id]);
        const [updatedProduct] = await db.query('SELECT * FROM product_info WHERE id = ?', [id]);
        
        res.status(200).json({
            code: 200,
            msg: '预出库信息更新成功',
            result: updatedProduct[0]
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

// 预出库信息修改
exports.updateQtyOutinfo = async (req, res) => {
    try {
        const { id, qty } = req.body; 
        const [product] = await db.query('SELECT * FROM product_info WHERE id = ?', [id]);
        if (product.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '产品不存在',
                result: {}
            });
        }
        
        // 检查库存是否足够
        if (product[0].quantity < qty) {
            return res.status(400).json({
                code: 400,
                msg: '库存不足',
                result: {}
            });
        }
        
        // 检查预出库数量是否足够
        if ((product[0].co_qty || 0) < qty) {
            return res.status(400).json({
                code: 400,
                msg: '预出库数量不足',
                result: {}
            });
        }
        
        // 更新库存和预出库数量
        const newQuantity = product[0].quantity - Number(qty);
        const newCoQty = (product[0].co_qty || 0) - Number(qty);
        console.log(newQuantity, newCoQty);
        
        await db.query('UPDATE product_info SET quantity = ?, co_qty = ? WHERE id = ?', [newQuantity, newCoQty, id]);
        // 获取更新后的物品信息
        const [updatedProduct] = await db.query('SELECT * FROM product_info WHERE id = ?', [id]);
        
        res.status(200).json({
            code: 200,
            msg: '出库成功',
            result: updatedProduct[0]
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

// 预出库撤回
exports.recallQtyOutinfo = async (req, res) => {
    try {
        const { id, co_qty } = req.body;
        
        // 检查产品是否存在
        const [product] = await db.query('SELECT * FROM product_info WHERE id = ?', [id]);
        if (product.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '产品不存在',
                result: {}
            });
        }
        
        // 检查预出库数量是否足够
        if ((product[0].co_qty || 0) < co_qty) {
            return res.status(400).json({
                code: 400,
                msg: '预出库数量不足',
                result: {}
            });
        }
        
        // 更新预出库数量
        const newCoQty = (product[0].co_qty || 0) - Number(co_qty);
        
        await db.query('UPDATE product_info SET co_qty = ? WHERE id = ?', [newCoQty, id]);
        
        // 获取更新后的产品信息
        const [updatedProduct] = await db.query('SELECT * FROM product_info WHERE id = ?', [id]);
        
        res.status(200).json({
            code: 200,
            msg: '预出库撤回成功',
            result: updatedProduct[0]
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