const crypto = require('crypto');
const getConnection = require('../config/database');
const LocalStrategy = require('passport-local').Strategy;
function initializeLocal(passport) {
  const authenticateUser = async (email, password, done) => {
    let db;
    try {
      db = await getConnection();
      const result = await db.query('SELECT * FROM users WHERE email=?', [
        email,
      ]);
      if (result.length === 0) {
        return done(null, false);
      }
      const isValid = validPassword(password, result[0].hash, result[0].salt);
      user = [
        {
          id: result[0].id,
          email: result[0].email,
        },
      ];
      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (e) {
      return done(e);
    } finally {
      if (db) db.end();
    }
  };
  passport.use(
    'local',
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}

function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 60, 'sha512')
    .toString('hex');
  return hash === hashVerify;
}

module.exports = initializeLocal;
