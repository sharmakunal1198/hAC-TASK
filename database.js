var mysql = require('mysql');
var bodyParser = require('body-parser');

let coll={}; 

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "task"

});

con.connect(function(error){
    if(error)
    {
        console.log("database is not connect");
    }else{
        console.log("conntected");
    }

});

coll.register = (userName,email,password,callback) => {
        
    console.log(userName);
    con.query("insert into user (userName,email,password) values(?,?,?)",[userName,email,password],function(error) {
        let result=1;
        if(error)
        {    
            console.log(error+"error ouccured at insertion");
            result=0;
            callback(result);
        }else{
            console.log("data inerted succesfully");
            callback(result);
        }
    });
}

// function for login
coll.login = (username,password,callback) => {
        console.log(username);
        console.log(password);
        con.query("select * from user where username=? and password=?",[username,password],function(error,data,fields){
            let result=1;
        
            if(error)
            {
                console.log("error ouccered at login");
                result=0;
                callback(result);
        
            }else{
                if(!data.length){
                    console.log("not exist in database");
                    result=0;
                    callback(result);
                }else{
                    // let userName = JSON.parse(data);
                
                    // console.log(email);
                    console.log("Logged in correctely");
                    // result=1;
                    callback(result,username);}
                // }
            }
        });
}

coll.getemail =(username,callback)=>{
    con.query("select email,password from user where username=?",[username],function(error,data,fields){
        result=0;
        if(error)
        {
             console.log("error in result data"+error);
             result=0;
             callback(error,null);
             
        }else{
             result=1;
             console.log("email in database======="+data[0].email);
             console.log("passwprd in database======="+data[0].password);
             callback(null,data[0]);      
             
            }
    });
}

coll.insertnote = (username,note,callback) => {
        
    console.log(note);
    let pin_status=0;
    let archived_status=1;
    con.query("insert into notes (username,note,pin_status,archived_status) values(?,?,?,?)",[username,note,pin_status,archived_status],function(error) {
        let result=1;
        if(error)
        {    
            console.log(error+"error ouccured at insertion pf note");
            result=0;
            callback(result);
        }else{
            console.log("note inerted succesfully");
            callback(result);
        }
    });
}

coll.getnotes = (username,callback) =>{
      
    con.query("select * from notes where label is NULL and username=? order by pin_status desc,id desc",[username],function(error,data){
     if(error)
     {
          console.log("error in select notes data"+error);
          callback(data);
      }else{
          console.log("data is passed from notesdatabase");
          callback(data);
           
     }

    });
}

coll.pinupdate = (pin_status,id,callback) =>{
    console.log("pinstatus:---------------"+pin_status);
    console.log("id============"+id);
    con.query("update notes set pin_status=? where id=?",[pin_status,id],function(error,data){
     if(error)
     {
          console.log("error in select notes data"+error);
          callback(data);
      }else{
          console.log("data is passed from notesdatabase");
          callback(data);
           
     }

    });
}

coll.updatelabel = (label,id,callback) =>{
    console.log("label in database:---------------"+label);
    console.log("id============"+id);
    con.query("update notes set label=? where id=?",[label,id],function(error,data){
     if(error)
     {
          console.log("error in select notes data"+error);
          callback(data);
      }else{
          console.log("data is passed from notesdatabase");
          callback(data);
           
     }

    });
}

coll.archiveupdate = (archive_status,id,callback) =>{
    console.log("archive_status in database:---------------"+archive_status);
    console.log("id============"+id);
    con.query("update notes set archived_status=? where id=?",[archive_status,id],function(error,data){
     if(error)
     {
          console.log("error in updating archived_status"+error);
          callback(data);
      }else{
          console.log("data is passed from notesdatabase");
          callback(data);
           
     }

    });
}

coll.addlabel = (username,note,label,callback) => {
    let pin_status=0;
    let archived_status=0;     
    console.log(label);
    con.query("insert into notes (username,label,note,pin_status,archived_status) values(?,?,?,?,?)",[username,label,note,pin_status,archived_status],function(error) {
        let result=1;
        if(error)
        {    
            console.log(error+"error ouccured at insertion");
            result=0;
            callback(result);
        }else{
            console.log("data inerted succesfully");
            callback(result);
        }
    });
}
coll.getlabel = (label,username,callback) =>{
     
    con.query("select * from notes where label =? and username=?",[label,username],function(error,data){
     if(error)
     {
          console.log("error in select notes data"+error);
          callback(data);
      }else{
          console.log("data is passed from notesdatabase");
          callback(data);
     }
    });
}

coll.deletenote = (id,callback) =>{
     
    con.query("delete from notes where id=?",[id],function(error,data){
     if(error)
     {
          console.log("error in deleting data"+error);
          callback(data);
      }else{
          console.log("data is sucessfully deleted");
          callback(data);
     }
    });
}

module.exports =coll;  