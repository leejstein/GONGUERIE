var createError = require('http-errors');
var express = require('express');
var router = express.Router();

const helper = require('../helper');
const bcrypt = require('bcrypt');

var db = require("../config/mysql");
var conn = db.init();

router.get('/', function(req, res) {
  res.render('signin');
});

router.post('/', function(req, res, next) {
  var cmd = 'SELECT pw from user where id = ?';
  params = [req.body.id];
  conn.query(cmd, params, function(err, result) {
    if(err) {
      console.error('Query Error: ', err);
      next(createError(400));
    } else {
      bcrypt.compare(req.body.pw, result[0].pw, (err, result) => {
        if (err) {
          // Handle error
          console.error('Error comparing passwords:', err);
          next(createError(503));
          return;
        }
        if (result) {
          // Passwords match, authentication successful
          console.log('Passwords match! User authenticated.');
          // res.redirect("/");
          res.status(200).send();
          // req.session.user = {
          //   id: req.body.id,
          //   authorized: true,
          // };
        } else {
          // Passwords don't match, authentication failed
          console.log('Passwords do not match! Authentication failed.');
          res.status(400).send();
        }
      });
    }
  });
});

module.exports = router;
