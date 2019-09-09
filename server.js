const express = require('express')
const bodyParser= require('body-parser')
const dbConfig = require('./config/db.config.js')
const mongoose = require('mongoose')
const cors = require('cors');

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.set('views', './src/views');
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('pages/index')
})

require('./src/routes/api.routes.js')(app)
require('./src/routes/unit.routes.js')(app)
require('./src/routes/subject.routes.js')(app)
require('./src/routes/topic.routes.js')(app)
require('./src/routes/concept.routes.js')(app)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
