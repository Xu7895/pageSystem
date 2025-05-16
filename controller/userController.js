const db = require('../config/db');
const bcrypt = require('bcryptjs'); // 用于加密密码
const jwt = require('jsonwebtoken'); // 用于生成 JWT

// 登录逻辑
exports.login = async (req, res) => {
  try {
    // 获取传入的账号密码
    const { account, password } = req.body;
    const isPhone = /^1[3-9]\d{9}$/.test(account);
    const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(account);
    let query = 'SELECT * FROM user WHERE ';
    if (isPhone) {
      query += 'phone = ?';
    } else if (isEmail) {
      query += 'email = ?';
    } else {
      query += 'uname = ?';
    }
    // 查询用户是否存在
    const [rows] = await db.query(query, [account]);
    if (rows.length === 0) {
      return res.status(400).json({
        code: 400,
        msg: '用户不存在',
        result: {}
      });
    }
    // 比对密码
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.pwd);
    if (!passwordMatch) {
      return res.status(401).json({
        code: 401,
        msg: '密码错误',
        result: {}
      });
    }
    // 生成 JWT Token
    const token = jwt.sign(
      { userId: user.id, username: user.uname },
      process.env.JWT_SECRET || '123456',
      { expiresIn: '4h' }
    );

    res.status(200).json({
      code: 200,
      msg: '登录成功',
      result: {
        token: token, id: user.id, username: user.uname, authority: user.authority
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

// 注册逻辑
exports.register = async (req, res) => {
  try {
    // 1、获取用户传入的用户名、密码、性别
    const { username, password, sex, phone, authority } = req.body;
    const depository_id = 0;
    // 2、检查用户名是否已经存在
    const [rows] = await db.query('SELECT * FROM user WHERE uname = ?', [username]);
    if (rows.length > 0) {
      // 如果用户名已存在，返回错误
      return res.status(400).json({
        code: 400,
        message: '用户名已存在',
        result: {}
      });
    }
    // 检查手机号是否已经存在
    const [phoneRows] = await db.query('SELECT * FROM user WHERE phone = ?', [phone]);
    if (phoneRows.length > 0) {
      // 如果手机号已存在，返回错误
      return res.status(401).json({
        code: 401,
        message: '手机号已被注册',
        result: {}
      });
    }
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10); // 使用 bcrypt 加密密码，10 是 saltRounds
    // 获取当前日期
    const entryDate = new Date().toISOString().slice(0, 10);
    // 将用户信息存入数据库
    await db.query('INSERT INTO user (uname, pwd, sex, entry_date, phone, authority, depository_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [username, hashedPassword, sex, entryDate, phone, authority, depository_id]);
    // 返回成功响应
    res.status(201).json({
      code: 200,
      message: '注册成功',
      result: {
        username: username,
        sex: sex,
        entry_date: entryDate,
        phone: phone
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      result: {}
    });
  }
};

// 修改密码
exports.updatePassword = async (req, res) => {
  try {
    const { id, oldPassword, newPassword } = req.body;
    console.log(id, oldPassword, newPassword);
    // 获取用户当前密码
    const [user] = await db.query('SELECT pwd FROM user WHERE id = ?', [id]);
    console.log(user);
    if (user.length === 0) {
      return res.status(404).json({
        code: 404,
        msg: '用户不存在',
        result: {}
      });
    }
    // 比对旧密码
    const isMatch = await bcrypt.compare(oldPassword, user[0].pwd);
    if (!isMatch) {
      return res.status(400).json({
        code: 400,
        msg: '原密码错误',
        result: {}
      });
    }
    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // 更新密码
    await db.query('UPDATE user SET pwd = ? WHERE id = ?', [hashedPassword, id]);

    res.status(200).json({
      code: 200,
      msg: '密码修改成功',
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

// 获取用户信息(只获取id和uname)
exports.getAllUserIdName = async (req, res) => {
  try {
    // 1、获取用户信息
    const [rows] = await db.query('SELECT id, uname FROM user');
    // 2、返回用户信息
    res.status(200).json({
      code: 200,
      msg: '用户信息获取成功',
      result: rows
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

// 获取用户信息(除了密码)
exports.getUserInfo = async (req, res) => {
  try {

    const { id } = req.body;
    const [user] = await db.query('SELECT uname, sex, authority, depository_id, email, phone, entry_date FROM user WHERE id = ?', [id]);
    if (user.length === 0) {
      return res.status(404).json({
        code: 404,
        msg: '用户不存在',
        result: {}
      });
    }
    // 返回用户信息
    res.status(200).json({
      code: 200,
      msg: '用户信息获取成功',
      result: user
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

// 获取所有用户信息（除了密码）
exports.getAllUsers = async (req, res) => {
  try {
    // 查询所有用户信息，排除密码字段
    const [users] = await db.query('SELECT id, uname, sex, authority, depository_id, email, phone, entry_date FROM user');

    // 返回用户信息
    res.status(200).json({
      code: 200,
      msg: '获取所有用户信息成功',
      result: users
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

// 修改用户信息（除了密码）
exports.updateUserInfo = async (req, res) => {
  try {
    const { id, uname, sex, authority, depository_id, email, phone } = req.body;
    await db.query('UPDATE user SET uname = ?, sex = ?, authority = ?, depository_id = ?, email = ?, phone = ? WHERE id = ?', [uname, sex, authority, depository_id, email, phone, id]);
    res.status(200).json({
      code: 200,
      msg: '用户信息修改成功',
      result: {
        uname: uname,
        sex: sex,
        phone: phone
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

// 修改用户部分信息（姓名，性别，手机，邮箱）
exports.updateBasicUserInfo = async (req, res) => {
  try {
    const { id, name, sex, phone, email } = req.body;
    await db.query('UPDATE user SET uname = ?, sex = ?, phone = ?, email = ? WHERE id = ?', [name, sex, phone, email, id]);
    res.status(200).json({
      code: 200,
      msg: '用户信息修改成功',
      result: {
        uname: name,
        sex: sex,
        phone: phone,
        email: email
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
}

// 修改用户权限 负责仓库
exports.updateUserPower = async (req, res) => {
  try {
    const { id, authority, depository_id } = req.body;
    await db.query('UPDATE user SET authority = ?, depository_id = ? WHERE id = ?', [authority, depository_id, id]);
    res.status(200).json({
      code: 200,
      msg: '用户权限修改成功',
      result: {
        authority: authority,
        depository_id: depository_id
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
}


