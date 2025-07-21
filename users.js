const express = require('express')
const knex = require('knex')
const router = express.Router()

module.exports = router

router.get('/', (req, res) => {
  res.send({
    result: 'success',
    message: 'api -> System Data',
    1: 'get - reverseString?text=StringToBeReverse',
    2: 'post - authenticate {username: eark,userpassword: 123}',
    3: 'post - authorize {token:FAKE TOKEN,otp:225566}',
    4: 'post - getUserTable',
    5: 'post - addUser{username: eark,userpassword: 123,superuserflag: 1,userdesc: Eark dev เทพ, emailaddress: earkha@gmail.com,  workstationlogin: IT,userstatus: ACTIVE}',
    6: 'post - getUserInformationByToken *with header token*',
  })
})
router.post('/getUserInformationByToken', async (req, res) => {
  try {
    let token = req.headers.token
    let sql = "select u.user_dept,u.userdesc,current_timestamp curdate, dep.description"
    +" from user_name u"
    +" left join department dep on u.user_dept = dep.dept "
    +" where token ='"+token+"'"
    let data= await req.db.raw(sql)
    console.log(sql);

    res.send({
      result: 'success',
      data,
      sql,
    })
}  catch(e) {
    res.send({
      result: 'failed',
      message: e.message,
    })
  }
})
// test call
router.get('/reverseString', async (req, res) => {
  try {
    let message = req.query?.text || ''
    if (message) 
      message = message.split('').reverse().join('');

    res.send({
      result: 'success',
      message,
    })
}  catch(e) {
    res.send({
      result: 'failed',
      message: e.message,
    })
  }
})

router.post('/authenticate',async (req, res) => {
  let form = req.body;
  try 
  {
    let data = await req.db("user_name").select('userstatus')
    .where('username',form.username+'')
    .where('userpassword',form.userpassword+'');

    if(data)
    {
      if (data[0].userstatus == 'ACTIVE') {
        let sql = "update user_name SET TOKEN=uuid() where username='"+form.username+"' AND userpassword='"+form.userpassword+"'"
        +" AND userid>0"

        await req.db.raw(sql)

        data = await req.db("user_name")
          //.select('username', 'userdesc', 'superuserflag', 'editlevel', 'emailaddress', 'token')
          .where('username', form.username)
          .where('userpassword', form.userpassword);
      } else {
        res.send({
          result: false,
          userstatus:'INACTIVE'
        })     
        return true;  
      }

      res.send({
        result: true,
        data,
      })
    } else {
      res.send({
        result: false,
        data,
      })      
    }
  } catch (e) {
    res.send({
      result: 'fail',
      Message: e.message,
    })
  }
})

router.post('/authorize',async (req, res) => {
  let form = req.body;
  let token = req.headers.token;
  try 
  {
    let data = await req.db('user_name').select('userid')
    .where('token',token)
    .where('otp',req.body.otp);
    let autority;
    if(data.length){
      autority = req.db('authorize').select('modulecode','modulename','formname')
      .where('userid',data[0].userId)
      res.send({
        result: true,
        autority,
      }) 
    } else {
      res.send({
        status:200,
        result: true,
        autority,
      }) 
    }
  } catch (e) {
    res.send({
      result: 'failed',
      message: e,
    })
  }
})
router.post('/addUser',async (req, res) => {
  let form = req.body;
  try 
  {
    await req.db("user_name").insert({...form});
    
    res.send({
      result: 'Insert success',
    }) 
  } catch (e) {
    res.send({
      result: 'failed',
      message: e,
    })
  }
})

router.get('/getUserTable',async (req, res) => {
  let form = req.body;
  try 
  {
    let sqlData = await req.db('user_name')
    
    if (sqlData.length){
      res.send({
        result:"success",
        data: sqlData,
      })
    } else {
      res.send({
        result:"No User table found",
        data:[]
      })
    }  
  } catch (e) {
    res.send({
      result: 'failed',
      message: e,
    })
  }
})