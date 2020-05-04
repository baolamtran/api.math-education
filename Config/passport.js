const passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    JWTStrategy = require('passport-jwt').Strategy,
    ExtractJWT = require('passport-jwt').ExtractJwt,
    userModel = require('../Model/User')

passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            session: false,
        },
        async (username, password, done) => {
            try {
              const user = await userModel.getUser(username)
                    if (user === null) {
                        return done(null, false, { message: 'incorrect username or password' });
                    }
                    const isValidPass = await userModel.validPassword(username,password);
                      if (!isValidPass){
                      return done(null, false, { message: 'incorrect username or password' });
                    }
                    console.log('user found & authenticated');
                    return done(null, user);

                
            } catch (err) {
                done(err);
            }
        },
    ),
);
const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret',
  };
  
  passport.use(
    'jwt',
    new JWTStrategy(opts, (jwt_payload, done) => {
      try {
        userModel.findUserById(jwt_payload.id).then(user => {

          console.log(jwt_payload.id)
          if (user) {
            console.log('user found in db in passport');
            done(null, user);
          } else {
            console.log('user not found in db');
            done(null, false);
          }
        });
      } catch (err) {
        done(err);
      }
    }),
  );