const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    port:3306,
    database: process.env.MYSQL_DATABASENAME,
    password: process.env.MYSQL_PASSWORD,
});

db.connect( (err)=>{
    if(err){
        console.log("mysql connection error", err.stack);
    }else{
        console.log("mysql connected succesfull");
    };
});
 
module.exports = db;