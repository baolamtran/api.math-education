var express = require('express');
var router = express.Router();

const userModel = require('../controller/User')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/login', userModel.loginUser)
router.post('/register',userModel.registerUser);
router.get('/me', userModel.getUser);
router.get('/logout' , userModel.logout);
router.post('/getUser', userModel.getUserByUsername);

module.exports = router;
