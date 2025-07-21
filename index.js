const express = require('express');
const cors = require('cors');
const knex = require('knex');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

const uri = 'mongodb+srv://oreminer690:EJgSWnYSaNuI3rTE@cluster0.nfjrs3c.mongodb.net/erp?retryWrites=true&w=majority&tls=true';

let db;

async function connectMongo() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    db = client.db('erp'); // ตั้งชื่อ database ที่คุณจะใช้
    console.log('Connected to MongoDB Atlas');
  } catch (e) {
    console.error('MongoDB Connection Error:', e);
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
app.use('/users', require('./users2'));

// connect to mongoDB
connectMongo(); 

// เริ่ม server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { connectMongo, getDB: () => db };
