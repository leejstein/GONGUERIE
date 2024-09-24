var createError = require('http-errors');
var express = require('express');
var router = express.Router();

const helper = require('../helper');
const bcrypt = require('bcrypt');

var db = require("../config/mysql");
var conn = db.init();

router.get('/', function(req, res) {
  res.render('signup');
});

router.post('/', function(req, res, next) {
  bcrypt.hash(req.body.pw, 10, (err, hash) => {
    if (err) {
      // Handle error
      console.error('Hash Error: ', err);
      next(createError(503));
      return;
    }
    // Hashing successful, 'hash' contains the hashed password
    var cmd = 'INSERT INTO user (id, pw) VALUES ( ? , ? );';
    params = [req.body.id, hash];
    conn.query(cmd, params, function(err, result) {
      if(err) {
        console.error('Query Error: ', err);
        next(createError(400));
      } else {
        req.session.user = {
          id: req.body.id,
          authorized: true,
        };
        res.status(200).send();
      }
    });
  });
});

module.exports = router;
