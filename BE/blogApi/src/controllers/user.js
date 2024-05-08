"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
// User Controller:

const User = require("../models/user");
const Token = require("../models/token");
const passwordEncrypt  = require("../helpers/passwordEncrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "List Users"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */
    //? admin haricindeki kullanıcılar silinen kullanıcıları göremez.
    const customFilter = req.user?.isAdmin ? {} : { isDeleted: false };

    const data = await res.getModelList(User, customFilter);
    // console.log(req.user);

     //? For activity raw data
    //  data.map((user) => {
    //   console.log(user.username, user._id);
    // })

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(User, customFilter),
      data,
    });
  },

  create: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Create User"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "username": "test",
                    "password": "Test1234*",
                    "email": "test@site.com",
                    "isActive": true,
                    "isAdmin": false,
                }
            }
        */

    //? ilk oluşturulurken yetki minimum olarak kullanıcıya verilir. Daha sonra güncellenir
    // req.body.isAuthor = false;
    req.body.isAdmin = false;

     //? slug:
     req.body.slug = req.body.username
     .split(" ")
     .join("-")
     .toLowerCase()
     .replace(/[^a-zA-Z0-9-]/g, "");

    const data = await User.create(req.body);


   //? Register işleminden sonra:
        /* AUTO LOGIN */
        //SIMPLE TOKEN:
        const tokenData = await Token.create({
          userId: data._id,
          token: passwordEncrypt(data._id + Date.now())
      })

        // JWT:
        const accessToken = jwt.sign(data.toJSON(), process.env.ACCESS_KEY, {
          expiresIn: "30m",
        });
        const refreshToken = jwt.sign(
          { _id: data._id, password: data.password },
          process.env.REFRESH_KEY,
          { expiresIn: "3d" }
        );
        /* AUTO LOGIN */

   
    res.status(201).send({
      error: false,
      token: tokenData.token,
      bearer: { accessToken, refreshToken },
      userData: data
    });
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Get Single User"
        */


    //? admin haricindeki kullanıcılar silinen kullanıcıları göremez.
  const  customFilters = req.user?.isAdmin ? {} : { isDeleted: false };
  customFilters._id = req.params.id;

    const data = await User.findOne(customFilters);
    

    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Update User"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                    "email": "test@site.com",
                    "isActive": true,
                    "isStaff": false,
                    "isAdmin": false,
                }
            }
        */

   

    // Admin olmayan isAuthor veya isAdmin durumunu değiştiremez
    if (!req.user.isAdmin) {
      // delete req.body.isAuthor;
      delete req.body.isAdmin;
      delete req.body.isDeleted;
      delete req.body.DeletedId;
      delete req.body.deletedAt;
      delete req.body.isActive;
    }

    //Bir kullanıcının başka bir kullanıcıyı güncellemesini engelle (admin güncelleyebilir):
    let customFilter = { _id: req.params.id };
    if (!req.user.isAdmin) {
      customFilter = { _id: req.user._id };
    }

    if(req.body.username){
       //? slug:
    req.body.slug = req.body.username
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
    }

    const data = await User.updateOne({ ...customFilter }, req.body, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      data,
      new: await User.findOne({ ...customFilter }),
    });
  },

  delete: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Delete User"
        */

    //? kullanıcı zaten silinmiş ise 404 hatası verilir.
    const isAlreadyDeletedUser = (await User.findOne({ _id: req.params.id }))
      .isDeleted;
      // console.log(isAlreadyDeletedUser);
    if (isAlreadyDeletedUser) {
    return  res.status(404).send({ error: true, message: "User not found" });
    }
    
    let customFilter = { _id: req.params.id };
    if (!req.user.isAdmin) {
      //? admin değilse kendi id'sini aldık
      customFilter = { _id: req.user._id };
    }


    //? admin kendini silememeli:
   const doNotDeleteAdminUser = (await User.findOne(customFilter)).isAdmin;
    if (doNotDeleteAdminUser) {
      return  res.status(403).send({ error: true, message: "You can't delete yourself as admin because system will be broken" });
    }


    //? soft delete işlemi:
    const data = await User.updateOne(
      customFilter,
      { deletedAt: new Date(), isDeleted: true, deletedId: req.user._id, isActive: false },
    );

    //? kullanıcı silinince erişimini engellemek için:
    await Token.deleteOne({ userId: customFilter._id });

  
    //?zaten silinmiş ise 404 hatası yukarıda verdik
    res.sendStatus(204);
  },

  //? silinmiş kullanıcıları listelemek için kullanılır.
  listDeleted: async (req, res) => {
    /*
              #swagger.tags = ["Users"]
                #swagger.summary = "List Deleted Users"
                #swagger.description = `
                    You can send query with endpoint for filter[], search[], sort[], page and limit.
                    <ul> Examples:
                        <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                        <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                        <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
                        <li>URL/?<b>page=2&limit=1</b></li>
                    </ul>
                `
            */

    //? admin haricindeki kullanıcılar silinen kullanıcıları göremez.
    //? permission kontrolu: route' da isAdmin

    let customFilter = { isDeleted: true };
    const data = await res.getModelList(User, customFilter, [
      { path: "deletedId", select: "username firstName lastName" },
    ]);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(User, customFilter),
      data,
    });
  },
};
