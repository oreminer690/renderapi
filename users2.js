const express = require('express');
const router = express.Router();

// 👇 เส้นทาง root เพื่อแสดงรายการ API ที่มีให้ใช้
router.get('/', (req, res) => {
  res.send({
    result: 'success',
    message: 'api -> System Data',
    1: 'get - reverseString?text=StringToBeReverse',
    2: 'post - authenticate {username: eark, userpassword: 123}',
    3: 'post - authorize {token: FAKE TOKEN, otp: 225566}',
    4: 'post - getUserTable',
    5: 'post - addUser {username, userpassword, superuserflag, userdesc, emailaddress, workstationlogin, userstatus}',
    6: 'post - getUserInformationByToken *with header token*',
  });
});

// 👇 Reverse string (ทดสอบง่าย ๆ)
router.get('/reverseString', async (req, res) => {
  try {
    let message = req.query?.text || '';
    if (message)
      message = message.split('').reverse().join('');

    res.send({
      result: 'success',
      message,
    });
  } catch (e) {
    res.send({
      result: 'failed',
      message: e.message,
    });
  }
});

// 👇 เพิ่มผู้ใช้ใหม่ (MongoDB)
router.post('/addUser', async (req, res) => {
  const form = req.body;
  try {
    const result = await req.db.collection('user_name').insertOne(form);
    res.send({
      result: 'Insert success',
      insertedId: result.insertedId,
    });
  } catch (e) {
    res.send({
      result: 'failed',
      message: e.message,
    });
  }
});

// 👇 ดึงข้อมูล user ทั้งหมด
router.post('/getUserTable', async (req, res) => {
  try {
    const users = await req.db.collection('user_name').find({}).toArray();
    if (users.length) {
      res.send({
        result: 'success',
        data: users,
      });
    } else {
      res.send({
        result: 'No User table found',
        data: [],
      });
    }
  } catch (e) {
    res.send({
      result: 'failed',
      message: e.message,
    });
  }
});

// 👇 Login ตรวจสอบ user และ password
router.post('/authenticate', async (req, res) => {
  const { username, userpassword } = req.body;
  try {
    const user = await req.db.collection('user_name').findOne({ username, userpassword });
    if (!user) {
      return res.send({ result: false, message: 'Invalid credentials' });
    }

    if (user.userstatus !== 'ACTIVE') {
      return res.send({ result: false, userstatus: 'INACTIVE' });
    }

    const token = generateFakeToken(); // หรือใช้ uuid
    await req.db.collection('user_name').updateOne({ username }, { $set: { token } });

    const updatedUser = await req.db.collection('user_name').findOne({ username });

    res.send({
      result: true,
      data: updatedUser,
    });
  } catch (e) {
    res.send({
      result: 'fail',
      message: e.message,
    });
  }
});

// 👇 Authorization ด้วย token + otp
router.post('/authorize', async (req, res) => {
  const { otp } = req.body;
  const token = req.headers.token;
  try {
    const user = await req.db.collection('user_name').findOne({ token, otp });
    if (!user) {
      return res.send({ result: false, message: 'Invalid token or OTP' });
    }

    const authority = await req.db.collection('authorize')
      .find({ userid: user.userid })
      .toArray();

    res.send({
      result: true,
      authority,
    });
  } catch (e) {
    res.send({
      result: 'failed',
      message: e.message,
    });
  }
});

// 👇 ดึงข้อมูลผู้ใช้ด้วย token (ใช้ header: token)
router.post('/getUserInformationByToken', async (req, res) => {
  const token = req.headers.token;
  try {
    const user = await req.db.collection('user_name').findOne({ token });
    if (!user) {
      return res.send({ result: 'not found', data: null });
    }

    res.send({
      result: 'success',
      data: {
        userdesc: user.userdesc,
        user_dept: user.user_dept,
        email: user.emailaddress,
        timestamp: new Date(),
      },
    });
  } catch (e) {
    res.send({
      result: 'failed',
      message: e.message,
    });
  }
});

function generateFakeToken() {
  // คุณสามารถใช้ uuid หรือ crypto.randomUUID() แทน
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

module.exports = router;
