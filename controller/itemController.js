const db = require('../config/db');

// 获取所有物品
exports.getAllItems = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM items');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 获取单个或多个物品(模糊查询)
exports.getItemsByName = async (req, res) => {
    const {name} = req.query;
    try {
        const [rows] = await db.query('SELECT * FROM items WHERE name LIKE ?', [`%${name}%`]);
        if (rows.length == 0 ){
            return res.status(404).json({ error: '物品不存在' });
        }
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 创建物品
exports.createItem = async (req, res) => { 
    const { name, category, specification, unit } = req.body;
    
    if (!name || !category || !unit) {
        return res.status(400).json({ error: '缺少必要字段' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO items (Name, Category, Specification, Unit) VALUES (?, ?, ?, ?)',
            [name, category, specification, unit]
        );
        res.json({ ItemID: result.insertId, name, category, specification, unit });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 更新物品
exports.updateItem = async (req, res) => {
    const { name, category, specification, unit } = req.body;
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: '缺少 ItemID' });
    }

    try {
        const [result] = await db.query(
            'UPDATE items SET Name=?, Category=?, Specification=?, Unit=? WHERE ItemID=?',
            [name, category, specification, unit, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: '物品不存在' });
        }
        res.json({ message: '更新成功' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 删除物品
exports.deleteItem = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: '缺少 ItemID' });
    }

    try {
        const [result] = await db.query('DELETE FROM items WHERE ItemID=?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: '物品不存在' });
        }
        res.json({ message: '删除成功' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

