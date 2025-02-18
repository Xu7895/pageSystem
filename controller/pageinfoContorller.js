const db = require('../config/db');

// 获取仓库所有信息
exports.getAllStore = async (req, res) => {
    try {
        // 1、查询数据库中的所有仓库信息
        const [stores] = await db.query('SELECT * FROM pageinfo'); // 这里假设表名为 stores
        
        // 2、返回查询结果
        res.status(200).json({
            code: 200,
            msg: '获取仓库信息成功',
            result: stores // 将查询到的仓库信息返回
        });
    } catch (err) {
        // 错误处理
        console.error(err);
        res.status(500).json({
            code: 500,
            msg: '服务器内部错误',
            result: {}
        });
    }
};

// 模糊查询仓库
exports.getStoreByName = async (req, res) => {
    try {
        // 1、获取请求中的仓库名称（可以是部分名称）
        const { dname } = req.query; // 假设前端通过查询参数传递仓库名称

        // 2、如果未传入仓库名称，返回错误
        if (!dname) {
            return res.status(400).json({
                code: 400,
                msg: '仓库名称不能为空',
                result: {}
            });
        }

        // 3、使用 LIKE 关键字进行模糊查询
        const [stores] = await db.query('SELECT * FROM pageinfo WHERE dname LIKE ?', [`%${dname}%`]);

        // 4、如果没有找到仓库，返回空结果
        if (stores.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '没有找到匹配的仓库',
                result: []
            });
        }

        // 5、返回查询结果
        res.status(200).json({
            code: 200,
            msg: '查询成功',
            result: stores // 返回查询到的仓库信息
        });
    } catch (err) {
        // 捕获错误
        console.error(err);
        res.status(500).json({
            code: 500,
            msg: '服务器内部错误',
            result: {}
        });
    }
};


// 创建仓库
exports.createStore = async (req, res) => {
    try {
        // 1、获取请求体中的仓库信息
        const { dname, address, introduce } = req.body;

        // 2、检查仓库名是否已经存在（避免重复创建）
        const [existingStore] = await db.query('SELECT * FROM pageinfo WHERE dname = ?', [dname]);
        if (existingStore.length > 0) {
            // 仓库名已存在
            return res.status(400).json({
                code: 400,
                msg: '仓库名称已存在，请使用不同的名称',
                result: {}
            });
        }

        // 3、将仓库信息插入数据库
        const [result] = await db.query('INSERT INTO pageinfo ( dname, address, introduce) VALUES (?, ?, ?)', [ dname, address, introduce]);

        // 4、返回成功响应
        res.status(201).json({
            code: 200,
            msg: '仓库创建成功',
            result: {
                id: result.insertId,
                dname,
                address,
                introduce
            }
        });
    } catch (err) {
        // 捕获错误
        console.error(err);
        res.status(500).json({
            code: 500,
            msg: '服务器内部错误',
            result: {}
        });
    }
};

// 修改仓库信息
exports.updateStore = async (req, res) => {
    try {
        // 1、获取请求体中的仓库信息
        const { id, dname, address, introduce } = req.body;

        // 2、检查仓库是否存在
        const [existingStore] = await db.query('SELECT * FROM pageinfo WHERE id = ?', [id]);
        if (existingStore.length === 0) {
            // 如果仓库不存在，返回错误
            return res.status(404).json({
                code: 404,
                msg: '仓库未找到',
                result: {}
            });
        }

        // 3、准备修改的字段，如果某个字段未传递则不更新
        const updateFields = {};
        if (dname) updateFields.dname = dname;
        if (address) updateFields.address = address;
        if (introduce) updateFields.introduce = introduce;

        // 4、构造 SQL 更新语句
        let updateQuery = 'UPDATE pageinfo SET ';
        let updateValues = [];
        Object.keys(updateFields).forEach((key, index) => {
            updateQuery += `${key} = ?`;
            updateValues.push(updateFields[key]);
            if (index < Object.keys(updateFields).length - 1) {
                updateQuery += ', ';
            }
        });

        updateQuery += ' WHERE id = ?';
        updateValues.push(id);

        // 5、执行 SQL 更新
        const [result] = await db.query(updateQuery, updateValues);

        // 6、返回成功响应
        res.status(200).json({
            code: 200,
            msg: '仓库信息更新成功',
            result: {
                id,
                ...updateFields // 返回更新的字段
            }
        });
    } catch (err) {
        // 错误处理
        console.error(err);
        res.status(500).json({
            code: 500,
            msg: '服务器内部错误',
            result: {}
        });
    }
};


// 删除仓库
exports.deleteStore = async (req, res) => {
    try {
        // 1、获取请求中的仓库 ID
        const { id } = req.query; // 假设前端通过 URL 参数传递仓库 ID
        
        // 2、检查仓库是否存在
        const [store] = await db.query('SELECT * FROM pageinfo WHERE id = ?', [id]);
        if (store.length === 0) {
            // 如果仓库不存在，返回 404 错误
            return res.status(404).json({
                code: 404,
                msg: '仓库未找到',
                result: {}
            });
        }

        // 3、删除仓库
        await db.query('DELETE FROM pageinfo WHERE id = ?', [id]);

        // 4、返回成功响应
        res.status(200).json({
            code: 200,
            msg: '仓库删除成功',
            result: {}
        });
    } catch (err) {
        // 捕获错误
        console.error(err);
        res.status(500).json({
            code: 500,
            msg: '服务器内部错误',
            result: {}
        });
    }
};
