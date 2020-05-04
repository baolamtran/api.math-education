const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const saltRounds = 10;
const USERS = 'Users';
const user = new Schema(
    {
      username: String,
      password: String,
      firstName: String,
      lastName: String,
      sex: String,
      address: String,
      phone: String
    },
    { collection: USERS }
  );
  const list = mongoose.model(USERS, user);

  const getUser = async (username) => {
    return await list.findOne({ 'username': username });
  };

  const findUserById = async (id) => {
    return await list.findOne({ username: id });
  };

  const saveUser = async (newUser) => {
    const NewUser = new list(newUser);
    bcrypt.hash(newUser.password, saltRounds, function (err, hash) {
      NewUser.password = hash;
      NewUser.save((err) => { });
    })
  };

  const validPassword = async (username, password) => {
    const user = await getUser(username);
    if (!user)
      return false;
    else {
      if (user.active == false) {
        return false
      }
      return await bcrypt.compare(password, user.password);
    }
  };

  const getUserByUsername = async (req, res) => {
    list.findOne({ 'username': req.body.username }).exec((err, user) => {
      if (err) {
        console.log('load user by username false');
      } else {
        res.json({
            username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          sex: user.sex,
          address: user.address,
          phone: user.phone,
        })
      }
    });
  }

  module.exports = {
    list: list,
    getUser: getUser,
    findUserById: findUserById,
    saveUser: saveUser,
    validPassword: validPassword,
    getUserByUsername: getUserByUsername,
  };