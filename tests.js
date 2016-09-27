var db = db||require("./db");

db.getSchools({},(res)=>console.log(JSON.stringify(res)));
