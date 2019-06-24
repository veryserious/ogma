const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:subjectRoutes');

const subjectRouter = express.Router();

function router(nav) {
  subjectRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'ogma';

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to the server');

          const db = client.db(dbName);

          const col = await db.collection('subjects');

          const subjects = await col.find().toArray();
          res.render(
            'subjectListView',
            {
              nav,
              title: 'Subjects',
              subjects,
            },
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

    subjectRouter.route('/submit')
    .post((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'ogma';

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to the server');

          const db = client.db(dbName);

          const col = await db.collection('subjects');
          
          col.save(req.body, (err, result) => {
            if (err) return console.log(err)
        
            console.log('saved to database')
            res.redirect('/subjects')
          })

        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

  subjectRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      const url = 'mongodb://localhost:27017';
      const dbName = 'ogma';

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to the server');

          const db = client.db(dbName);
          const col = await db.collection('subjects');
          const subject = await col.findOne({ _id: new ObjectID(id) });

          res.render(
            'subjectView',
            {
              nav,
              title: 'Subject',
              subject,
            },
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

  return subjectRouter;
}

module.exports = router;