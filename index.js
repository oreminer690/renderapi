const express = require('express');
const cors = require('cors');
const knex = require('knex');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// สร้าง connection ของ knex
/*
const db = knex({
  client: "mysql",
  connection: {
    host: "localhost",      // หรือเปลี่ยนเป็น IP / hostname ของ MySQL server
    user: "hugdelph_db",    // ใส่ username ของฐานข้อมูล
    password: "Iloveyou",   // รหัสผ่านฐานข้อมูล
    database: "hugdelph_db",// ชื่อฐานข้อมูล
    port: 3306,
  },
});
*/

const uri = 'mongodb+srv://oreminer690:EJgSWnYSaNuI3rTE@cluster0.nfjrs3c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let db;

async function connectMongo() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    db = client.db('erp'); // ตั้งชื่อ database ที่คุณจะใช้
    console.log('✅ Connected to MongoDB Atlas');
  } catch (e) {
    console.error('❌ MongoDB Connection Error:', e);
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// ส่ง db ให้กับทุก request ผ่าน req.db
app.use((req, res, next) => {
  req.db = db;
  next();
});

// ตัวอย่าง route แรก เพื่อทดสอบว่า server ทำงาน
app.get('/', (req, res) => {
  res.send('Hello from your Render API!');
});

// นำเข้า router users (สมมติมีไฟล์ users.js ในโฟลเดอร์ routes)
app.use('/users', require('./users'));

// connect to mongoDB
connectMongo(); 

// เริ่ม server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { connectMongo, getDB: () => db };

/*

router.use('/expOveSell', require('./expOveSell')) // export oversea selling
router.use('/deliOrd', require('./deliOrd')) // delivery order
router.use('/invoice', require('./invoice')) // invoice
router.use('/forecast', require('./forecast')) // forecast
router.use('/custPriceList', require('./custPriceList')) // customer price list
router.use('/monCustOrd', require('./monCustOrd')) // Monthly Customer Order List By Duedate (Report)
router.use('/system', require('./system')) // get running number
router.use('/items', require('./items')) // Item management (CRUD)
router.use('/orderPickList', require('./orderPickList'))
router.use('/itemcrossref', require('./itemcrossref'))
router.use('/customerorder', require('./customerorder'))
router.use('/customer', require('./customer'))
router.use('/report', require('./report'))
router.use('/coSoldPartList', require('./coSoldPartList'))
router.use('/users', require('./users'))
router.use('/compForecast', require('./compForecast'))
router.use('/monSalAnaByItem', require('./monSalAnaByItem')) // Monthly Sales Analysis By Item Report
router.use('/purchase', require('./purchase'))
router.use('/baseUnit', require('./baseUnit'))
router.use('/demo', require('./demo'))
*/
