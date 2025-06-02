'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');

const app = express();

//For FCC testing purposes
fccTesting(app);
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// my code 

const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const { ObjectID } = require('mongodb');

app.set('view engine', 'pug');
app.set('views', './views/pug');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

myDB(async client => {
  const myDataBase = await client.db('database').collection('users');
  passport.use(new LocalStrategy((username, password, done) => {
    myDataBase.findOne({ username: username }, (err, user) => {
      console.log(`User ${username} attempted to log in.`);
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (password !== user.password) { return done(null, false); }
      return done(null, user);
    });
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser( async (id, done) => {
    try {
      const doc = await myDataBase.findOne({ _id: new ObjectID(id) });
      done(null, doc);
    } catch (err) {
      done(err);
    }
  });

  app.route('/').get((req, res) => {
    res.render('index', { 
      title: 'Connected to Database', 
      message: 'Please log in',
      showLogin: true,
      showRegistration: true
    });
  });

  app.route('/register').post((req, res, next) => {
    myDataBase.findOne({ username: req.body.username }, (err, user) => {
      if (err) {
        next(err);
      } else if (user) {
        res.redirect('/');
      } else {
        myDataBase.insertOne({
          username: req.body.username,
          password: req.body.password
        },
        (err, doc) => {
          if (err) {
            res.redirect('/');
          } else {
            next(null, doc,ops[0]);
          }
        }
      )
      }
    })
  },
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res, next) => {
      res.redirect('/profile');
    }
);
  
  app.route('/login').post(passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/profile');
  });
  
  app.route('/profile').get(ensureAuthenticated, (req,res) => {
    res.render('profile', {
      username: req.user.username
    });
  });
  
  app.route('/logout').get((req, res) => {
    req.logout(err => {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });
  
  app.use((req, res, next) => {
    res.status(404)
    .type('text')
    .send('Not Found');
  });
  
}).catch(e => {
  app.route('/').get((req, res) => {
    res.render('index', {
      title: e,
      message: 'Unable to connect to database'
    });
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

// end my code 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
