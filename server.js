const express = require('express');
const bodyParser= require('body-parser')

const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017", function (err, client) {
    if(err) { return console.dir(err); }

    console.log("we are connected"); 
    var db = client.db("ogma");

    app.listen(3000, function() {
        console.log('listening on 3000')
    })
    
    app.get('/', (req, res) => {
        var cursor = db.collection("concepts").find();
        cursor.toArray(function(err, result) {
            if (err) return console.log(err)
            // renders index.ejs
            res.render('index.ejs', {concepts: result})
          })
    })
    
    app.post('/concepts', (req, res) => {
        db.collection('concepts').insertOne(req.body, (err, result) => {
            if (err) return console.log(err)
        
            console.log('saved to database')
            res.redirect('/')
          })
    })

});
