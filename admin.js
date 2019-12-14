var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
//var logger = require('morgan');
var neo4j = require('neo4j-driver');

var app = express();
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
//app.use(logger('dev'));

var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j' ,'123456'));
var session = driver.session();
//view admin page
app.get('/admin',function(req,res)
{
    res.render('adminPage');
});
app.get('/',function(req,res)
{
    res.render('index');
});


app.post('/action', function(req,res)
{
    var name = req.body.adminname;
    var pass = req.body.adminpass;
    session
    .run('MATCH(n:admin {name:{nameParam}}) RETURN n', {nameParam:name})
    .then(function(result)
    {
        result.records.forEach(function(record)
        {
            console.log(record._fields[0].properties)
            var data = record._fields[0].properties;
            if(data.passwors == pass)
            {
                res.render('adminLog');
                console.log('correct');
            }
            else{
                console.log('incorrect');
            }
        });
        
    })
   
    .catch(function(err)
    {
        console.log(err);
    });

});


/*app.post('/action',function(req,res)
{
    var Name = req.body.name;
    var Email = req.body.email;
    var Pass = req.body.pass;
    
   // console.log(Name);
    session
    .run('CREATE (n:user {name:{nameParam},email:{emailParam},pass:{passParam}})', {nameParam:Name ,emailParam:Email ,passParam:Pass})
    .then(function(result)
    {
        var dup;
        result.records.forEach(function(test)
        {
            var read = test._fields[0].properties;
            if(read.email == Email)
            {
                dup = 1;
            }
          
        })
        if(dup ==1)
        {
            console.log('already');
            res.send('Already Registered');
           // res.redirect('/');
        }
        else{
            res.redirect('/');
            console.log('not');
        }
       
        //session.close();
    })
   
    .catch(function(err)
    {
        console.log(err);
    })
   // res.redirect('/');
})
*/
app.listen(3000);
console.log('server port number 3000');
module.exports = app;