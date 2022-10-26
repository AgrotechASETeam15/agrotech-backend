const express = require('express');
let router = express.Router();
const passport = require('passport');
const getConnection = require('../services/config/database');
const crypto = require('crypto');
const initializeLocal = require('../services/passport/emailConfig');

initializeLocal(passport);

async function LocalUserExists(req, res, next) {
  let db;
  try {
    db = await getConnection();
    const results = await db.query('Select * from users where email=? ', [
      req.body.email,
    ]);

    if (results.length > 0) {
      return res.json({
        success: false,
        message:
          'Opps !! Email already Registered, Please login or use another email.',
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  } finally {
    if (db) db.end();
  }
}
function genPassword(password) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genhash = crypto
    .pbkdf2Sync(password, salt, 10000, 60, 'sha512')
    .toString('hex');
  return { salt: salt, hash: genhash };
}
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(404).send({ message: 'User is not authenticated' });
}

router.post('/register', LocalUserExists, async (req, res) => {
  let db;

  try {
    db = await getConnection();
    console.log(db);
    const saltHash = genPassword(req.body.password);
    console.log(saltHash);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const result = await db.query(
      'Insert into users(full_name,email,hash,salt) values(?,?,?,?) ',
      [req.body.name, req.body.email, hash, salt]
    );
    if (result) {
      return res
        .status(200)
        .send({ success: true, message: 'Email Registered successfully' });
    }
  } catch (error) {
    console.log(error);
    return res.send({ message: error.message });
  } finally {
    if (db) db.end();
  }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  if (req.user) {
    return res.status(200).send({
      success: true,
      user: req.user,
      message: 'User logged in successfully',
    });
  } else {
    if (req.user) {
      return res
        .status(404)
        .send({ success: false, message: 'user is not authenticated' });
    }
  }
});

module.exports = router;
