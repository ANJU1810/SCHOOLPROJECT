var express=require('express');
var path=require('path');
var logger=require('morgan');
var bodyParser=require('body-parser');
var neo4j=require('neo4j-driver');

var app=express();
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

var driver=neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','rootlet'));

var session=driver.session();

//Registration
app.get('/school-reg',function(req,res){
    
    res.render('schoolReg');
 });

 //school login
 app.get('/',function(req,res){
    
    res.render('schoolLog');
 });

 //post for reg
 app.post('/school/reg',function(req,res){
    var name=req.body.name;
    var address=req.body.address;
    var place=req.body.place;
    var phone=req.body.phone;
    var email=req.body.email;
    var password=req.body.password;
    //console.log(name);
    session
    .run('MATCH(p:School) MERGE (n:School {name:{nameParam},address:{addressParam},place:{placeParam},phone:{phoneParam}, email:{emailParam},password:{passwordParam}}) RETURN p',{nameParam:name,addressParam:address,placeParam:place,phoneParam:phone, emailParam:email, passwordParam:password})
    .then(function(result){
        var check;
        
       // res.render('login');
       result.records.forEach(function(record){
        var db=record._fields[0].properties;
        
        if(db.email==email){
            check=1;
        }
    
      
    })
    if(check==1)
    {
        console.log('Already registered');
        res.render('schoolLog');
      
    }
    else{
        console.log('Successfully Registered');
        res.render('schoolLog');
    }
    
       session.close();
    })
    .catch(function(err){
        console.log(err);
    });
    
    
    });
    //Login
app.post('/school/login',function(req,res){
    var email=req.body.email;
 var password=req.body.password;
 //console.log(name);
 session
 .run('MATCH (user:School{email:{emailParam},password:{passParam}}) RETURN user',{emailParam:email,passParam:password})
 .then(function(results){
    
     
         //var dbUser = _.get(results.records[0].get('user'), 'properties');
         results.records.forEach(function(record){
             var db=record._fields[0].properties;
             if(db.email==email){
                 console.log('correct');
                 res.render('schoolHome',{
                     users:record._fields[0].properties.name
                 });
             }
            
             else{
                console.log('incorrect');
                res.send('incorrect username or password');
             }
         });
        
 })
   
 .catch(function(err){
     console.log(err);
 });
 //res.redirect('/');
 });


app.listen(3000);
console.log('server is running at port 3000');

module.exports=app;