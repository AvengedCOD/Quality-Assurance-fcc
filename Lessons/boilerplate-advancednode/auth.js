require('dotenv').config();
const { ObjectID } = require('mongodb');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

module.exports = function (app, myDataBase) {
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

  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://127.0.0.1:3000/auth/github/callback'
  },
    function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
      myDataBase.findOneAndUpdate(
        { id: profile.id },
        {
          $setOnInsert: {
            id: profile.id,
            username: profile.username,
            name: profile.displayName || 'John Doe',
            photo: profile.photos[0].value || '',
            email: Array.isArray(profile.emails)
              ? profile.emails[0].value
              : 'No public email',
            created_on: new Date(),
            provider: profile.provider || ''
          },
          $set: {
            last_login: new Date()
          },
          $inc: {
            login_count: 1
          }
        },
        { upsert: true, new: true },
        (err, doc) => {
          return cb(null, doc.value);
        }
      );
    }
  ));

  passport.use(new LocalStrategy((username, password, done) => {
    myDataBase.findOne({ username: username }, (err, user) => {
      console.log(`User ${username} attempted to log in.`);
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  }));
}