const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const { db, genid } = require("../db/DbUtils")

router.post("/login", async (req, res) => {

    let { account, password } = req.body;
    let { err, rows } = await db.async.all("select * from `admin` where `account` = ? AND `password` = ?", [account, password])

    if (err == null && rows.length > 0) {

        let login_token = uuidv4();
        let update_token_sql = "UPDATE `admin` SET `token` = ? where `id` = ?"

        await db.async.run(update_token_sql,[login_token,rows[0].id])

        let admin_info = rows[0]
        admin_info.token = login_token
        admin_info.password = ""

        res.send({
            code: 200,
            msg: "登录成功",
            data:admin_info
        })
    } else {
        res.send({
            code: 500,
            msg: "登录失败"
        })
    }
})

router.post("/signIn", async (req, res) => {

    let {userName, account, password , email} = req.body;
    let id = genid.NextId()

    const insert_sql =
    'INSERT INTO `admin` (`id`,`account`,`password`,`userName`,`email`) VALUES (?,?,?,?,?)'
    let params = [id, account, password, userName, email]
    
    let { err, rows } = await db.async.run(insert_sql, params)

  
    if (err == null) {
        let login_token = uuidv4();
        let update_token_sql = "UPDATE `admin` SET `token` = ? where `id` = ?"

        await db.async.run(update_token_sql,[login_token,rows[0].id])

        let admin_info = rows[0]
        admin_info.token = login_token
        admin_info.password = ""

        res.send({
          code: 200,
          msg: '注册成功',
        })
      } else {
        res.send({
          code: 500,
          msg: '注册失败',
        })
      }
    })

module.exports = router