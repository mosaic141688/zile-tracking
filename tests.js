var db = db||require("./db");
//db.resetRegistration("76543554747",(res)=>console.log(res));
db.getSchools({},(res)=>console.log(JSON.stringify(res)));
//db.signinSchool("mosaic@zile.xyz","qwerty",(res)=>console.log(res));
