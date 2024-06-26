"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Auth Controller:

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Token = require("../models/token");
const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {
  login: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with username (or email) and password for get Token and JWT.'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "email": "test@example.com",
                    "password": "Test123*",
                }
            }
        */

    const { username, email, password } = req.body;

    if ((username || email) && password) {
      const user = await User.findOne({ $or: [{ username }, { email }] });

      if (user && user.password == passwordEncrypt(password)) {
        // aktif olmayan ve silinen kullanıcılar login olmamalı
        if (user.isActive && !user.isDeleted) {
          // Use UUID:
          // const { randomUUID } = require('crypto')
          // let tokenData = await Token.findOne({ userId: user._id })
          // if (!tokenData) tokenData = await Token.create({
          //     userId: user._id,
          //     token: randomUUID()
          // })

          // TOKEN:
          let tokenData = await Token.findOne({ userId: user._id });
          if (!tokenData)
            tokenData = await Token.create({
              userId: user._id,
              token: passwordEncrypt(user._id + Date.now()),
            });

          // JWT:
          const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_KEY, {
            expiresIn: "30m",
          });
          const refreshToken = jwt.sign(
            { _id: user._id, password: user.password },
            process.env.REFRESH_KEY,
            { expiresIn: "3d" }
          );

          //? password göndermek istemiyorum:
          //? her ikisi de aynı
          //   const {password, ...userData} = user._doc
          const { password, ...userData } = user.toJSON();

          res.send({
            error: false,
            token: tokenData.token,
            bearer: { accessToken, refreshToken },
            userData,
          });
        } else {
          res.errorStatusCode = 401;
          throw new Error("This account is deleted or not active.");
        }
      } else {
        res.errorStatusCode = 401;
        throw new Error("Wrong username/email or password.");
      }
    } else {
      res.errorStatusCode = 401;
      throw new Error("Please enter username/email and password.");
    }
  },

  refresh: async (req, res) => {
    /*
            #swagger.tags = ['Authentication']
            #swagger.summary = 'JWT: Refresh'
            #swagger.description = 'Refresh access-token by refresh-token.'
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    bearer: {
                        refresh: '___refreshToken___'
                    }
                }
            }
        */

    const refreshToken = req.body?.bearer?.refreshToken;

    if (refreshToken) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_KEY,
        async function (err, userData) {
          if (err) {
            res.errorStatusCode = 401;
            throw err;
          } else {
            const { _id, password } = userData;

            if (_id && password) {
              const user = await User.findOne({ _id });

              if (user && user.password == password) {
                if (user.isActive) {
                  // JWT:
                  const accessToken = jwt.sign(
                    user.toJSON(),
                    process.env.ACCESS_KEY,
                    { expiresIn: "30m" }
                  );

                  res.send({
                    error: false,
                    bearer: { accessToken },
                  });
                } else {
                  res.errorStatusCode = 401;
                  throw new Error("This account is not active.");
                }
              } else {
                res.errorStatusCode = 401;
                throw new Error("Wrong id or password.");
              }
            } else {
              res.errorStatusCode = 401;
              throw new Error("Please enter id and password.");
            }
          }
        }
      );
    } else {
      res.errorStatusCode = 401;
      throw new Error("Please enter token.refresh");
    }
  },

  logout: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Token: Logout"
            #swagger.description = 'Delete token-key.'
        */

    const auth = req.headers?.authorization || null; // Token ...tokenKey... // Bearer ...accessToken...
    const tokenKey = auth ? auth.split(" ") : null; // ['Token', '...tokenKey...'] // ['Bearer', '...accessToken...']

    let message = null,
      result = {};

    if (tokenKey) {
      if (tokenKey[0] == "Token") {
        // SimpleToken

        result = await Token.deleteOne({ token: tokenKey[1] });
        message = "Token deleted. Logout was OK.";
      } else {
        // JWT

        message = "No need any process for logout. You must delete JWT tokens.";
      }
    }

    res.send({
      error: false,
      message,
      result,
    });
  },

  google: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Google Login or Register"
            #swagger.description = 'Login or Register with Google account.'
            
        */

    let { username, email, profilePicture } = req.body;

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        //? soft delete kullanıldığından dolayı, kendini silen google kullanıcısı tekrar giriş yapmak isterse, giriş yapması için aşağıdaki bilgileri de güncellemek gerekir.
        if (userExists.isDeleted) {
          userExists.isActive = true;
          userExists.isDeleted = false;
          userExists.DeletedId = null;
          userExists.deletedAt = null;
          userExists.deletedReason = null;
          //? sıfırdan yeniden kayıt olduğu görüntüsü için diğer bilgileri de sıfırlanabilir
          userExists.profilePicture = null;
          await userExists.save();
        }
        let tokenData = await Token.findOne({ userId: userExists._id });
        if (!tokenData)
          tokenData = await Token.create({
            userId: userExists._id,
            token: passwordEncrypt(userExists._id + Date.now()),
          });

        // JWT:
        const accessToken = jwt.sign(
          userExists.toJSON(),
          process.env.ACCESS_KEY,
          {
            expiresIn: "30m",
          }
        );
        const refreshToken = jwt.sign(
          { _id: userExists._id, password: userExists.password },
          process.env.REFRESH_KEY,
          { expiresIn: "3d" }
        );

        res.send({
          error: false,
          token: tokenData.token,
          bearer: { accessToken, refreshToken },
          userData: userExists,
        });
      } else {
        //? continue with google registration
        // TODO: passwordGenerator
        const password = "BruceWayne123*";
        username =
          username.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4); // aynı isimler gelebileceği için

        req.body.username = username;
        req.body.password = password;
        req.body.email = email;
        req.body.profilePicture = profilePicture;

        //? yukarıda req.body bilgilerini modele(required and validated) uygun doldurdum sonra aşağıda bu google kullanıcısını create ettim
        const userController = require("../controllers/user");
        userController.create(req, res);
      }
    } catch (error) {
      res.send({ error: true, message: error.message });
    }
  },
};
