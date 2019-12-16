var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
//var logger = require('morgan');
var neo4j = require('neo4j-driver');

var app = express();
app.set('views',path.join(__dirname,'views/admin'));
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
app.get('/approve',function(req,res)
{
    res.render('adminLog');
})

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
                res.render('adminEnter');
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
//view school name
app.post('/view',function(req,res)
{
    session
    .run('MATCH(n:school) RETURN n')
    .then(function(result)
    {
        var schoolArr = [];
        result.records.forEach(function(record)
        {
            console.log(record._fields[0].properties.name);
            schoolArr.push({
                name:record._fields[0].properties.name
                
            });

        });
        res.render('adminLog',{
           arr:schoolArr 
        })
    })
    .catch(function(err)
    {
        console.log(err);
    })
    //res.render('adminLog');
}) 

app.post('/approve',function(req,res)
{
    var Name = req.body.name;
    var nameSel = req.body.name1;
    if(nameSel == 'Approve')
    {
        session
        .run('MATCH(n:school {name:{nameParam}}) SET n.status="1"',{nameParam:Name})
        .then(function(result)
        {
            result.records.forEach(function(record)
            {
                console.log(record._fields[0].properties.status)
            })
           console.log('add');
           res.send('Approve');
        })
        .catch(function(err)
        {
            console.log(err);
        })
    }
    else
    {
        session
        .run('MATCH(n:school {name:{nameParam}}) SET n.status="0"',{nameParam:Name})
        .then(function(result)
        {
            result.records.forEach(function(record)
            {
                console.log(record._fields[0].properties.status)
            })
           console.log('rej');
           res.send('Reject');
        })
        .catch(function(err)
        {
            console.log(err);
        })
    }
   
})

app.listen(3000);
console.log('server port number 3000');
module.exports = app;