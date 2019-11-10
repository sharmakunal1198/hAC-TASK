var express = require('express');
var path = require('path');
const session = require('express-session');
var bodyParser  = require('body-parser');
var app = express();
var hbs = require('express-handlebars');
var database = require('./database.js');
var nodemailer = require('nodemailer');
// var handleBars = require('gulp-hb').handlebars;

global.color="";

app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',hbs());//{extname:'hbs',defaultLayout:'index.handlebars',layoutsDir:__dirname+'/views/layouts'}));
app.set('view engine','handlebars');


// it is all just use to handlebars in our application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

// Makeing every pakage staic
app.use("/css",express.static('css'));
app.use("/js",express.static('js'));
app.use("/images",express.static('images'));
app.use("/font",express.static('font'));
app.use("/vendor",express.static('vendor'));
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

// Session stored in sess
var sess;


app.get("/",function(req,res){
    res.render("index");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/addlabel",function(req,res){
    res.render("addlables");
});

app.get("/forgotpass",function(req,res){
    res.render("forgotpass");
});

app.post("/registerForm",function(req,res){
        let userName = req.body.username;
        let password = req.body.password;
        let email  = req.body.email;
        console.log(userName);
        let result = database.register(userName,email,password,result =>{
        console.log(result);
        if(result==1)
        {
            res.render("index");    
        }else{
            res.render("register");
        }
        });
});

app.post("/login",function(req,res)
{
    let password = req.body.password;
    let username  = req.body.username;
    console.log(username);
    console.log(password);
    let result = database.login(username,password,result =>{
    console.log(result);
    if(result==1)
    {
        sess = req.session;
        sess.username = username;
        // sess.email = email;
        console.log("inside getnotes");
        let data = database.getnotes(username,data =>{
 //    console.log(data);
        res.render("home",{data:data});
        });
    }else{
        res.render("index");
    }
    });
    
});

app.post("/mailsent",function(req,res)
{
    // global.otp=randomize('Aa0!',6);
    var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'collegeelctioncommision@gmail.com',
              pass: '$verma1198'
            }
          });
          
          let username = req.body.username;
        //   this for getting password
          let result1 =  database.getemail(username,(err, result1) =>{
              
            //   console.log("data.email=========="+result1);
            global.email=sess.email;
            global.password = result1.password;
            console.log("email============"+global.email);
            console.log("pass======="+global.password);
            if(result1!=null)
            {
                console.log("email retrive properly");
                
            }else{
                console.log("email not retrive properly");
            }   
        });  
            // console.log("safggjhj=============================="+global.email);                
            //   console.log("inside send mail"+vid);
                    var mailOptions = {
                        from: 'collegeelctioncommision@gmail.com',
                        to: global.email,
                        subject: " Password Of Keep Google ",
                        text: "Your Password for Login In Google Keep is:- "+global.password+"." 
                      };
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                          var msg="Email is not send";
                          res.render("index");
                        } else {
                            console.log('Email sent: ' + info.response);
                            // console.log("otp====="+otp);
                            var msg="Password is sended at your gmail account";
                            res.render("index");    
                        }
                // }
              });  

});

app.post("/uploadnote",function(req,res){
    sess = req.session;
    if(sess.username){
        let note = req.body.note;
        // let password = req.body.password;
        let username  = sess.username;

        console.log(username+"inerted this note"+note);
        let result = database.insertnote(username,note,result =>{
        console.log(result);
        if(result==1)
        {
            console.log("inside getnotes");
            let data = database.getnotes(username,data =>{
            res.render("home",{data:data});
            });   
        }else{
            console.log("inside getnotes");
            let data = database.getnotes(username,data =>{
            res.render("home",{data:data});
            });
        }
    });
}else{
        res.render("index");
    }
});

app.get("/archived",function(req,res){
    sess = req.session;
    if(sess.username){
    let username  = sess.username;
    let data = database.getnotes(username,data =>{
 //    console.log(data);
    res.render("archived",{data:data});
});
}else{
    res.render("index");
}
});

app.post("/home",function(req,res){
    console.log("inside getnotes");
    sess = req.session;
    if(sess.username){
    let username  = sess.username;
    let data = database.getnotes(username,data =>{
 //    console.log(data);
    res.render("home",{data:data});
});
}else{
    res.render("index");
}
});

app.get("/update",function(req,res){
      sess = req.session;
      if(sess.username){
         let username  = sess.username;
        let id=req.param('id');
        console.log("jhkdjhkfjhakdjfhksjdh"+id);    
        let pin_status = req.param('pin_status');
        if(pin_status==1)
        {
            pin_status=0;   
        }else{
            pin_status=1;
        }
        let result = database.pinupdate(pin_status,id,result =>{
            console.log(result);
            if(result==1)
            {
                console.log("inside getnotes");
                let data = database.getnotes(username,data =>{
                res.render("home",{data:data});
                });   
            }else{
                console.log("inside getnotes");
                let data = database.getnotes(username,data =>{
                res.render("home",{data:data});
                });
            }
        });
}else{
    res.render("index");
}

});

// app.get("/storecolor" ,function(req,res){
//     sess = req.session;
//     if(sess.username){
//        let username  = sess.username;
//       let id=req.param('color');
//       console.log("jhkdjhkfjhakdjfhksjdh"+color);    
//       let result = database.colorupdate(color,result =>{
//           console.log(result);
//           if(result==1)
//           {
//               console.log("inside getnotes");
//               let data = database.getnotes(username,data =>{
//               res.render("home",{data:data});
//               });   
//           }else{
//               console.log("inside getnotes");
//               let data = database.getnotes(username,data =>{
//               res.render("home",{data:data});
//               });
//           }
//       });
// }else{
//   res.render("index");
// }}
// );
app.get("/archive",function(req,res){
    sess = req.session;
    if(sess.username){
      let username  = sess.username;
      let id=req.param('id');
      console.log("jhkdjhkfjhakdjfhksjdh"+id);    
      let archive_status = req.param('archive_status');
      if(archive_status==1)
      {
          archive_status=0;   
      }else{
          archive_status=1;
      }
      let result = database.archiveupdate(archive_status,id,result =>{
          console.log(result);
          if(result==1)
          {
              console.log("inside getnotes");
              let data = database.getnotes(username,data =>{
              res.render("home",{data:data});
              });   
          }else{
              console.log("inside getnotes");
              let data = database.getnotes(username,data =>{
              res.render("home",{data:data});
              });
          }
      });
}else{
  res.render("index");
}
});


app.post("/addlabel",function(req,res){
    sess = req.session;
    if(sess.username){
    let username = sess.username;
    let label = req.body.label;
    let note = req.body.note;
    console.log(label);
    let result = database.addlabel(username,note,label,result =>{
    console.log(result);
    if(result==1)
    {  console.log("inside getnotes");
        let data = database.getnotes(username,data =>{
        res.render("home",{data:data});
        });    
    }else{
        res.render("addlables");
    }
    });
}else{
    res.render("index");
  }
});

app.get("/delete",function(req,res){
    sess = req.session;
    if(sess.username){
      let username  = sess.username;
      let id=req.param('id');
      console.log("jhkdjhkfjhakdjfhksjdh"+id);    
    //   let archive_status = req.param('archive_status');
          let result = database.deletenote(id,result =>{
          console.log(result);
          if(result==1)
          {
              console.log("inside getnotes");
              let data = database.getnotes(username,data =>{
              res.render("home",{data:data});
              });   
          }else{
              console.log("inside getnotes");
              let data = database.getnotes(username,data =>{
              res.render("home",{data:data});
              });
          }
      });
}else{
  res.render("index");
}
});


app.listen(9003,()=>{console.log("listening on port 9003")});