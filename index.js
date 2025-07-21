const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ MongoDB Atlas connection URI
const uri = 'mongodb+srv://oreminer690:EJgSWnYSaNuI3rTE@cluster0.nfjrs3c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let db;

// ✅ เชื่อมต่อ MongoDB Atlas
async function connectMongo() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
  });

  try {
    await client.connect();
    db = client.db('erp'); // ชื่อ database ที่คุณต้องการใช้
    console.log('✅ Connected to MongoDB Atlas');
  } catch (e) {
    console.error('❌ MongoDB Connection Error:', e);
  }
}

connectMongo(); // เรียกใช้เมื่อเริ่มแอป

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ ส่ง db ไปใน req
app.use((req, res, next) => {
  req.db = db;
  next();
});

// ✅ Default route
app.get('/', (req, res) => {
  res.send('Hello from your Render API!');
});

// ✅ Import routes
app.use('/users', require('./users')); // ต้องมีไฟล์ users.js ในโฟลเดอร์เดียวกัน

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});