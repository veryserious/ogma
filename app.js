const express = require('express');
const debug = require('debug')('app');
const bodyParser= require('body-parser')

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended: true}))

const nav = [
    { link: '/subjects', title: 'Subjects' }
  ];

const subjectRouter = require('./src/routes/subjectRoutes')(nav);

app.set('views', './src/views');
app.set('view engine', 'ejs')

app.use('/subjects', subjectRouter);

app.get('/', (req, res) => {
    res.render('index',
      {
        nav: [{ link: '/subjects', title: 'Subjects' },],
        title: 'Subjects',
      });
  });

app.listen(port, () => {
    debug(`listening on port ${port}`)
});
