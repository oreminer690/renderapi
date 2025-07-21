const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Hello from your Render API!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/* const express = require('express')

const router = express.Router()

module.exports = router

router.get('/', (req, res) => {
  res.send({
    result: 'success',
    message: 'api'
  })
})

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