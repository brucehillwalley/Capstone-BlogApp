"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
// User Controller:

const User = require("../models/user");

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
                    "password": "1234",
                    "email": "test@site.com",
                    "isActive": true,
                    "isStaff": false,
                    "isAdmin": false,
                }
            }
        */

    //? ilk oluşturulurken yetki minimum olarak kullanıcıya verilir. Daha sonra güncellenir
    // req.body.isAuthor = false;
    req.body.isAdmin = false;

    const data = await User.create(req.body);

    res.status(201).send({
      error: false,
      data,
    });
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Get Single User"
        */

    const data = await User.findOne({ isDeleted: false }); // isDeleted gerek olmayabilir

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

    // Admin olmayan isStaff veya isAdmin durumunu değiştiremez
    if (!req.user.isAdmin) {
      delete req.body.isStaff;
      delete req.body.isAdmin;
      delete req.body.isDeleted;
      delete req.body.DeletedId;
      delete req.body.DeletedDate;
    }

    // Başka bir kullanıcıyı güncellemesini engelle:
    let customFilter = { _id: req.params.id };
    if (!req.user.isAdmin && !req.user.isStaff) {
      customFilter = { _id: req.user._id };
    }

    const data = await User.updateOne({ ...customFilter }, req.body, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      data,
      new: await User.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Delete User"
        */

    // const data = await User.deleteOne({ _id: req.params.id })

    // res.status(data.deletedCount ? 204 : 404).send({
    //     error: !data.deletedCount,
    //     data
    // })
    //? kullanıcı zaten silinmiş ise 404 hatası verilir.
    const isAlreadyDeletedUser = (await User.findOne({ _id: req.params.id }))
      .isDeleted;
    if (isAlreadyDeletedUser) {
      return res.status(404).send({ error: true, message: "User not found" });
    }

    const data = await User.updateOne(
      { _id: req.params.id },
      { deletedDate: new Date(), isDeleted: true, deletedId: req.user._id }
    );

    // console.log(data);
    res.status(204).send({
      error: false,
      data,
    });
    //? soft delete işlemi yapıldı.
  },
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
