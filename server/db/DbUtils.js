const sqlite3 = require("sqlite3").verbose()
const path = require("path")
const GenId = require("../utils/SnowFlake")

var db = new sqlite3.Database(path.join(__dirname,"blog.sqlite3"))
// 雪花算法的机器码
const genid = new GenId({WorkerId:1})

db.async = {}
// db.async.all 方法定义了一个函数，接收 SQL 语句和参数列表作为输入，返回一个 Promise 对象。在 Promise 回调函数中会执行 db.all 方法，并将结果封装成 {err,rows} 对象传递给解析器。db.all 方法是 SQLite3 提供的一个方法，用于执行多行查询操作。
db.async.all = (sql,parms) =>{

    return new Promise((resolve,reject) => {
        db.all(sql,parms,(err,rows)=>{
            resolve({err,rows})
        })
    })
}
// db.async.run 方法定义了一个函数，接收 SQL 语句和参数列表作为输入，返回一个 Promise 对象。在 Promise 回调函数中会执行 db.run 方法，并将结果封装成 {err,rows} 对象传递给解析器。db.run 方法是 SQLite3 提供的一个方法，用于执行修改数据、插入数据等不提供返回行数据的操作。
db.async.run = (sql,parms) =>{

    return new Promise((resolve,reject) => {
        db.run(sql,parms,(err,rows)=>{
            resolve({err,rows})
        })
    })
}

module.exports = {db,genid}
