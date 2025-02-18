const db = require('../config/db');
const bcrypt = require('bcryptjs'); // 用于加密密码
const jwt = require('jsonwebtoken'); // 用于生成 JWT

// 登录逻辑
exports.login = async (req, res) => {
	try {
		// 1、获取传入的账号密码
		const { username, password } = req.body;

		// 2、查询数据库，查看用户是否存在
		const [rows] = await db.query('SELECT * FROM user WHERE uname = ?', [username]);
		if (rows.length === 0) {
			// 用户不存在
			return res.status(400).json({
				code: 400,
				msg: '用户名不存在',
				result: {}
			});
		}

		// 3、比对密码
		const user = rows[0]; // 假设查询到的第一条数据就是该用户
		const passwordMatch = await bcrypt.compare(password, user.pwd);
		
		if (!passwordMatch) {
			// 密码错误
			return res.status(400).json({
				code: 400,
				msg: '密码错误',
				result: {}
			});
		}

		// 4、生成 JWT Token
		const token = jwt.sign(
			{ userId: user.id, username: user.username }, // token 数据
			process.env.JWT_SECRET || 'your_jwt_secret', // 秘密钥匙
			{ expiresIn: '1h' } // 设置 token 过期时间
		);

		// 5、返回登录成功响应
		res.status(200).json({
			code: 200,
			msg: '登录成功',
			result: {
				username: user.username,
				entry_date: user.entry_date,
				token: token // 返回生成的 token
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
exports.register = async (req, res) => {
	try {
		// 1、获取用户传入的用户名、密码、性别
		const { username, password, sex } = req.body;

		// 2、检查用户名是否已经存在
		const [rows] = await db.query('SELECT * FROM user WHERE uname = ?', [username]);
		if (rows.length > 0) {
			// 如果用户名已存在，返回错误
			return res.status(400).json({ message: '用户名已存在' });
		}
		// 3、加密密码
		const hashedPassword = await bcrypt.hash(password, 10); // 使用 bcrypt 加密密码，10 是 saltRounds
		// 4、获取当前日期
		const entryDate = new Date().toISOString().slice(0, 10); // 获取当前日期，并格式化为 yyyy-mm-dd 格式
		// 5、将用户信息存入数据库
		await db.query('INSERT INTO user (uname, pwd, sex, entry_date) VALUES (?, ?, ?, ?)', [username, hashedPassword, sex, entryDate]);
		// 6、返回成功响应
		res.status(201).json({
			code: 200,
			message: '注册成功',
			result: {
				username: username,
				sex: sex,
				entry_date: entryDate // 返回注册日期
			}
		});
	} catch (err) {
		// 捕获错误并返回
		console.error(err);
		res.status(500).json({ message: '服务器内部错误' });
	}
};