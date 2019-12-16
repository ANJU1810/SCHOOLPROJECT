     var  express = require('express');
    var  path = require('path');
    var  logger = require('morgan');
    var  bodyParser = require('body-parser');
    var neo4j=require('neo4j-driver');
    var app=express();
    app.set('views',path.join(__dirname,'views/student'))
    app.set('view engine','ejs');
    app.use(logger('dev'))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(express.static(path.join(__dirname,'public')));
    var driver=neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','123456'));
    var session=driver.session();


     app.get('/',function(req,res){
        res.render('index');

       });
        app.post('/regi',function(req,res){
        var name=req.body.name;
        var  sex=req.body.sex;
        var password=req.body.password;

       var emailid=req.body.emailid;
        
        var address=req.body.address;
        var status=req.body.status;
         session
         .run('CREATE(n:Register {name:{nameParam}  ,sex:{sexParam} ,password:{passwordParam} ,emailid:{emailidParam},address:{addressParam},status:"0" }) RETURN n' ,{nameParam:name ,passwordParam:password,emailidParam:emailid,sexParam:sex,addressParam:address,statusParam:status})

         .then(function(result){
          res.redirect('/');
             //session.close();
         })  
         .catch(function(err){
             console.log(err);
 
 
         })
        });
 
           app.get('/studlog',function(req,res){
             res.render('studentlog');
            });
 
             app.post('/studlog',function(req,res){
             var emailid=req.body.emailid;
            // var password=req.body.password;
             session
             .run('MATCH(n:Register{emailid:{emailidParam}})RETURN n',{emailidParam:emailid})
             .then(function(result){
                 result.records.forEach(function(rec){
 
                     console.log(rec._fields[0].properties);
 
                     var a=rec._fields[0].properties;
 
                   /* if(a.password==password){
 
                         console.log("correct")
 
                        //res.render('adminview');
                     }
                     else{
                         console.log("failed")
                     res.end("failed ")
                     }*/

                
                 if(a.emailid==emailid)
                 {
                         console.log("Email id is correct")
                 }
                 else{
                        console.log("Failed Emailid try again")   
                 }
                 
                 if(a.status=="1"){
                        console.log("status is correct")    
                 }
                 else
                
                 {
                        console.log("status is failed tryagain")       
        
                 } 
                 })
              })
             .catch(function(err)
             
             {
                 console.log(err);
            })
           
         });
         
              app.listen(4000)
                console.log('welcome')
                module.exports=app;
        
 
 
    
               
 

        