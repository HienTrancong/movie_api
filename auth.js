const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); // Your local passport file

//function to generate JWT token
let generateJWTToken = (user) => {
  //jwt.sign(payload, secretOrPrivateKey, [options, callback])
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // Username encoding in the JWT
    expiresIn: '7d',
    algorithm: 'HS256'// algorithm to “sign” or encode JWT
  });
}

//POST login
module.exports = (router) => {
  router.post('/login', (req, res) => {
    //passport.authenticate(strategy, options, callback)(req, res, next); no session because using token based authen
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        console.log(error);
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token })
      });
    })(req, res);
  });
}
