var jwt = require('jsonwebtoken');
var passport = require('passport');
var userModel = require('../Model/User');

exports.loginUser = (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if (info != undefined) {
        console.log(info.message);
        res.send(info.message);
      } else {
        req.logIn(user, err => {
            userModel.getUser(user.username, user.password).then(user => {
            const token = jwt.sign({ id: user.username }, 'your_jwt_secret');
            res.status(200).send({
              returncode :  1,
              auth: true,
              token: token,
              message: 'user found & logged in',
            });
          });
        });
      }
    })(req, res, next);
  }

  exports.registerUser = (req, res, next) => {

        console.log('user found in db from route');
        const data = {
          username: req.body.username,
          password: req.body.password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          sex: req.body.sex,
          address: req.body.address,
          phone: req.body.phone,
  
        }
        userModel.saveUser(data).then(() => {
          console.log('user created in db');
          res.status(200).send({ returncode :  1 ,message: 'user created' });
        })
  
  }

  exports.defaultRouter = function (req, res, next) {
    res.send('respond with a resource');
  }

  exports.logout = async (req, res) => {

    req.logout();
  
  }
  

  exports.getUser = function (req, res) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
  
        console.log(err);
      }
      if (info != undefined) {
        console.log(info.message);
        res.send(info.message);
      } else {
        console.log('user found in db from route');
        res.status(200).json({
          returncode: 1,
          user:{
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          sex: user.sex,
          address: user.address,
          phone: user.phone,
        }});
      }
    })(req, res);
  }
  
  exports.getUserByUsername = (req, res) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err || !user) {
        console.log(err);
      }
      if (info != undefined) {
        console.log(info.message);
        res.send(info.message);
      } else {
        return userModel.getUserByUsername(req, res)
  
      }
    })(req, res);
  }