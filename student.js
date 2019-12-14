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
         session
        .run('CREATE(n:Register {name:{nameParam}  ,sex:{sexParam} ,password:{passwordParam} ,emailid:{emailid},address:{addressParam} }) RETURN n' ,{nameParam:name ,passwordParam:password,emailid:emailid,sexParam:sex,addressParam:address})

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
            var name=req.body.name;
            var password=req.body.password;
            session
            .run('MATCH(n:Register{name:{nameParam}})RETURN n',{nameParam:name})
            .then(function(result){
                result.records.forEach(function(rec){

                    console.log(rec._fields[0].properties);

                    var a=rec._fields[0].properties;

                    if(a.password==password){

                        console.log("correct")

                       //res.render('adminview');
                    }
                    else{
                        console.log("failed")
                    res.end("failed ")
                }
             })
             })
            .catch(function(err)
            {
                console.log(err);
            })
        });


        /* app.get('/stdregadminview',function(req,res){
            res.render('adminview');
            });
         
            app.post('/stdregadminview',function(req,res){
            session
            .run('MATCH(n:Register) RETURN n')
            .then(function(result){
            var view=[];
            result.records.forEach(function(records){
            view.push({
            id:records._fields[0].identity.low,
            name:records._fields[0].properties.name,
            sex:records._fields[0].properties.sex,
            address:records._fields[0].properties. address,
            password:records._fields[0].properties.password
            
        })
            //})
           //res.render('view',{
            //view1:view
            })
           })
            .catch(function(err){
            console.log(err)
            })
            });*/


           /*  app.get('/log',function(req,res){
                res.render('login');
                });
               app.post('/log',function (req, res) {
                var username=req.body.username;
                var password=req.body.password;
                session
                .run('MATCH (n:Register {username: {usernameParam}}) RETURN n' ,{usernameParam: username})
                .then(function(result){
                result.records.forEach(function(records){
                console.log(records._fields[0].properties);
                var a=records._fields[0].properties;
                if(a.password==password){
                console.log("correct")
                res.end("welcome")
                }
                else{
                console.log("failed")
                res.end("failed ")
                }
    
                });
    
               })
              
                .catch(function(err)
                {
                console.log(err);
               });
    
                });*/
                  app.listen(4000)
               console.log('welcome')
               module.exports=app;
