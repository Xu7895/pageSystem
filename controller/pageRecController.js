const db = require('../config/db');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

// 格式化时间函数
const formatDateTime = (date) => {
    if (!date) return null;
    return dayjs(date).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
};

// 格式化查询结果中的时间
const formatPageRecord = (record) => {
    if (!record) return null;
    return {
        ...record,
        apply_time: formatDateTime(record.apply_time),
        review_time: formatDateTime(record.review_time)
    };
};

// 获取所有页面记录
exports.getAllpageRec = async (req, res) => {
    try {
        const [pageRecords] = await db.query('SELECT * FROM page_record ORDER BY id DESC');
        const formattedRecords = pageRecords.map(formatPageRecord);
        res.status(200).json({
            code: 200,
            msg: '页面记录获取成功',
            result: formattedRecords
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

// 先通过userid获取user表中的depository_id，再通过depository_id获取相应的数据
exports.getPageRecBydepositoryId = async (req, res) => {
    try {
        const { userId } = req.body;
        const [userRows] = await db.query('SELECT depository_id FROM user WHERE id = ?', [userId]);
        
        if (userRows.length === 0) {
            return res.status(400).json({
                code: 400,
                msg: '用户不存在',
                result: {}
            });
        }
        
        const depositoryId = userRows[0].depository_id;
        
        // 如果depositoryId为0，获取所有记录
        if (depositoryId === 0) {
            const [pageRecords] = await db.query('SELECT * FROM page_record ORDER BY id DESC');
            const formattedRecords = pageRecords.map(formatPageRecord);
            return res.status(200).json({
                code: 200,
                msg: '页面记录获取成功',
                result: formattedRecords
            });
        }
        
        // 通过depository_id查询相关记录
        const [pageRecords] = await db.query('SELECT * FROM page_record WHERE depository_id = ? ORDER BY id DESC', [depositoryId]);
        const formattedRecords = pageRecords.map(formatPageRecord);
        res.status(200).json({
            code: 200,
            msg: '页面记录获取成功',
            result: formattedRecords
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

// 根据applicant_id获取记录
exports.getPageRecByApplicantId = async (req, res) => {
    try {
        const { applicant_id } = req.body;
        const [pageRecords] = await db.query('SELECT * FROM page_record WHERE applicant_id = ?', [applicant_id]);
        const formattedRecords = pageRecords.map(formatPageRecord);
        res.status(200).json({
            code: 200,
            msg: '页面记录获取成功',
            result: formattedRecords
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

// 获取入库页面记录
exports.getPutpageRec = async (req, res) => {
    try {
        const [pageRecords] = await db.query('SELECT * FROM page_record WHERE type = 1 ORDER BY id DESC');
        const formattedRecords = pageRecords.map(formatPageRecord);
        res.status(200).json({
            code: 200,
            msg: '入库记录获取成功',
            result: formattedRecords
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

// 获取出库页面记录
exports.getOutpageRec = async (req, res) => {
    try {
        const [pageRecords] = await db.query('SELECT * FROM page_record WHERE type = 0 ORDER BY id DESC');
        const formattedRecords = pageRecords.map(formatPageRecord);
        res.status(200).json({
            code: 200,
            msg: '出库记录获取成功',
            result: formattedRecords
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

// 创建(出入库)页面记录
exports.createpageRec = async (req, res) => {
    try {
        const {
            img_url,
            mname,
            depository_id,
            type,
            quantity,
            price,
            state,
            applicant_id,
            apply_remark,
            mt_id,
            pd_id
        } = req.body;

        // 验证必填字段
        if (!mname || !depository_id || type === undefined || !mt_id) {
            return res.status(400).json({
                code: 400,
                msg: '缺少必要字段',
                result: {}
            });
        }

        // 设置申请时间为当前时间（中国时区）
        const apply_time = dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');

        // 插入新记录
        const [result] = await db.query(
            'INSERT INTO page_record (img_url, mname, depository_id, type, quantity, price, state, applicant_id, apply_remark, apply_time, mt_id, pd_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [img_url, mname, depository_id, type, quantity, price, state, applicant_id, apply_remark, apply_time, mt_id, pd_id]
        );

        res.status(200).json({
            code: 200,
            msg: '页面记录创建成功',
            result: {
                id: result.insertId,
                mname,
                depository_id,
                type,
                quantity,
                price,
                state,
                applicant_id,
                apply_remark,
                apply_time
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

// 审核修改页面记录
exports.updatepageRec = async (req, res) => {
    try {
        const {
            id,
            state,
            reviewer_id,
            review_remark,
            review_pass
        } = req.body;

        // 检查记录是否存在
        const [pageRecord] = await db.query('SELECT * FROM page_record WHERE id = ?', [id]);
        if (pageRecord.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '页面记录未找到',
                result: {}
            });
        }

        // 准备更新字段
        const updateFields = {};
        if (state) updateFields.state = state;
        if (reviewer_id) updateFields.reviewer_id = reviewer_id;
        if (review_remark) updateFields.review_remark = review_remark;
        if (review_pass !== undefined) {
            updateFields.review_pass = review_pass;
            updateFields.review_time = dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss'); // 更新审核时间（中国时区）
        }

        // 构造更新查询
        let updateQuery = 'UPDATE page_record SET ';
        const updateValues = [];
        Object.keys(updateFields).forEach((key, index) => {
            updateQuery += `${key} = ?`;
            updateValues.push(updateFields[key]);
            if (index < Object.keys(updateFields).length - 1) {
                updateQuery += ', ';
            }
        });
        updateQuery += ' WHERE id = ?';
        updateValues.push(id);

        // 执行更新
        await db.query(updateQuery, updateValues);

        // 获取更新后的记录
        const [updatedRecord] = await db.query('SELECT * FROM page_record WHERE id = ?', [id]);
        const formattedRecord = formatPageRecord(updatedRecord[0]);

        res.status(200).json({
            code: 200,
            msg: '页面记录更新成功',
            result: formattedRecord
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

// 删除页面记录
exports.deletepageRec = async (req, res) => {
    try {
        const { id } = req.body;

        // 检查记录是否存在
        const [pageRecord] = await db.query('SELECT * FROM page_record WHERE id = ?', [id]);
        if (pageRecord.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '页面记录未找到',
                result: {}
            });
        }

        // 删除记录
        await db.query('DELETE FROM page_record WHERE id = ?', [id]);

        res.status(200).json({
            code: 200,
            msg: '页面记录删除成功',
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

// 获取仓库数量，物品总数，入库，出库记录总数
exports.getPgCount = async (req, res) => {
    try {
        // 获取仓库数量
        const [depositoryCount] = await db.query('SELECT COUNT(*) as count FROM pageinfo');
        // 获取物品总数
        const [materialCount] = await db.query('SELECT SUM(quantity - IFNULL(co_qty, 0)) as count FROM product_info');
        // 获取入库记录总数
        const [putCount] = await db.query('SELECT COUNT(*) as count FROM page_record WHERE type = 1');
        // 获取出库记录总数
        const [outCount] = await db.query('SELECT COUNT(*) as count FROM page_record WHERE type = 0');
        res.status(200).json({
            code: 200,
            msg: '统计数据获取成功',
            result: {
                depositoryCount: depositoryCount[0].count,
                materialCount: materialCount[0].count,
                putCount: putCount[0].count,
                outCount: outCount[0].count
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