"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
// Activity Controller:

const Activity = require("../models/activity");
const Category = require("../models/category");
const View = require("../models/view");

module.exports = {
  list: async (req, res) => {
    /*
    #swagger.tags = ["Activity"]
    #swagger.summary = "List Activities"
    #swagger.description = `You can send query with endpoint for filter[], search[], sort[], page and limit.
    <ul> Examples:
        <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>  
        <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
        <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
        <li>URL/?<b>page=2&limit=1</b></li>
    </ul> 
    `
    */

    let customFilters = {
      isPublished: true,
      isDeleted: false,
    };

    // console.log(req.user._id);
    // console.log(req.query.author);
    // console.log(req.query.author === req.user._id.toString());
    // console.log(req.query.author == req.user._id);
    // console.log(req.user._id.equals(req.query.author));
    // http://127.0.0.1:8000/activities?filter[isPublished]=0 //? admin publish olmayanları listeler diğer kullanıcılar gönderirse normal listeleme yapar
    // http://127.0.0.1:8000/activities?filter[isDeleted]=1  //?  admin silinenleri listeler diğer kullanıcılar gönderirse normal listeleme yapar

    //? kullanıcılar sadece kendi activity' larını listelemek isterse:
    //? query'den author bilgisini alıyoruz.
    //? query'den değerler str gelir.
    if (
      (req.query?.author && req.user?._id.equals(req.query?.author)) ||
      req.user?.isAdmin
    ) {
      customFilters.userId = req.query?.author;
      delete customFilters.isPublished;

      //? admin  silinenleri görebilir. (kendi veya başkası)
      req.user?.isAdmin && delete customFilters.isDeleted;

      //? admin başkasına ait author verisi gönderebilir bu durumda boş olmaz ve admin o kullanıcıyı listelemiş olur.
      //? query'den author bilgisi gelmez ise normal listeleme yapılacak demektir.
      //? customFilters.userId yoksa silme sebebi => { userId: undefined }
      customFilters.userId || delete customFilters.userId;
      // console.log(req.user._id);
      // console.log(req.query.author);
    } else if (req.query?.author && !req.user?._id.equals(req.query.author)) {
      res.errorStatusCode = 403;
      throw new Error("You are not allowed to list other's activities");
    }

    // if (req.user?.isAdmin) {
    //   customFilters = {};
    // }
    // console.log(customFilters);
    const data = await res.getModelList(Activity, customFilters);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Activity, customFilters),
      data: data,
    });
  },
  create: async (req, res) => {
    /*
        #swagger.tags = ["Activity"]
        #swagger.summary = "Create Activity"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                $ref: '#/definitions/Activity',
            }
        }
    */

    //? create kullanıcının kendi id'si ile olması lazım
    req.body.userId = req.user._id;

    //? categoryId yoksa categoryName ile bilgisini doldur
    if (!req.body.categoryId && req.body.categoryName) {
      const isExists = await Category.findOne({
        name: req.body.categoryName.toLowerCase(),
      });
      if (isExists) {
        req.body.categoryId = (
          await Category.findOne({
            name: req.body.categoryName.toLowerCase(),
          })
        )._id;
      }
    }
    //? slug:
    req.body.slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    const data = await Activity.create(req.body);

    res.status(201).send({
      error: false,
      body: req.body,
      data: data,
    });
  },
  read: async (req, res) => {
    /*
        #swagger.tags = ["Activity"]
        #swagger.summary = "Get Single Activity"
    */
    let customFilters = {
      isPublished: true,
      isDeleted: false,
    };

    //? kullanıcı kendine ait yayınlanmayan Activity' ı görebilir
    const userId = (await Activity.findOne({ _id: req.params.id })).userId;
    // console.log(req.user);
    // console.log(userId);
    if (userId.equals(req.user._id)) {
      customFilters = { isDeleted: false };
    }

    //? admin haricindeki kullanıcılar silinen ve yayınlanmayan Activity' yi göremez.
    if (req.user?.isAdmin) {
      customFilters = {};
    }

    const data = await Activity.findOne({
      _id: req.params.id,
      ...customFilters,
    });

    //? datayı çekebildiysem view tablosuna eklemeliyim
    console.log(req.ip);
    //?her read işlemi bir görüntüleme:
    const view = await View.create({
      userId: req.user._id,
      activityId: req.params.id,
      ipAddress: req.ip,
    });
    console.log(view);
    data.viewCount = data.viewCount + 1;
    await data.save();

    //? data view eklenmiş bir şekilde response'a aktarılır
    res.status(202).send({
      error: false,
      data: data,
    });
  },
  update: async (req, res) => {
    /*
        #swagger.summary = 'Update Activity'
        #swagger.description = 'Update Activity'
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                $ref: '#/definitions/Activity',
                
            }
        }

     */

    //? admin harici herkes kendi activity' sini güncelleyebilir
    if (!req.user.isAdmin) {
      delete req.body.isDeleted;
      delete req.body.DeletedId;
      delete req.body.deletedAt;

      const userId = (await Activity.findOne({ _id: req.params.id })).userId;
      // console.log(userId);
      // console.log(req.user._id);

      //? toString methodu ile karşılaştırma yapılabiliyor aksi halde objeler karşılaştırılmaz
      // if (userId.toString() !== req.user._id.toString()) {return res.status(403).send({ error: true, message: "Unauthorized" });}

      //? veya
      if (!userId.equals(req.user._id)) {
        return res.status(403).send({ error: true, message: "Unauthorized" });
      }
    }
    if (req.body.title) {
      req.body.slug = req.body.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, "");
    }

    const data = await Activity.updateOne({ _id: req.params.id }, req.body);
    const newdata = await Activity.findOne({ _id: req.params.id });
    res.status(202).send({
      error: false,
      body: req.body,
      data: data, // info about update
      // güncel veriyi istiyorsan tekrar çağır
      newdata: newdata,
    });
  },
  delete: async (req, res) => {
    //? activity zaten silinmiş ise 404 hatası verilir.
    const isAlreadyDeletedActivity = (
      await Activity.findOne({ _id: req.params.id })
    ).isDeleted;
    // console.log(isAlreadyDeletedActivity);
    if (isAlreadyDeletedActivity) {
      return res
        .status(404)
        .send({ error: true, message: "Activity not found" });
    }

    //? admin harici herkes sadece kendi activity' sini silebilir
    if (!req.user.isAdmin) {
      const userId = (await Activity.findOne({ _id: req.params.id })).userId;

      if (!userId.equals(req.user._id)) {
        return res.status(403).send({ error: true, message: "Unauthorized" });
      }
    }

    const data = await Activity.updateOne(
      { _id: req.params.id },
      {
        isDeleted: true,
        isPublished: false,
        deletedId: req.user._id,
        deletedAt: new Date(),
      }
    );

    //? 404 hatası yukarıda zaten silinmiş ise
    res.sendStatus(204);
  },

  //? silinmiş activity' lari listelemek için kullanılır.
  listDeleted: async (req, res) => {
    /*
    #swagger.tags = ["Activity"]
    #swagger.summary = "Get Deleted Activity"
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
    //? admin haricindeki kullanıcılar silinen activity' ları göremez.
    //? permission kontrolu: route' da isAdmin

    let customFilter = { isDeleted: true };
    const data = await res.getModelList(Activity, customFilter, [
      { path: "deletedId", select: "username firstName lastName" },
    ]);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Activity, customFilter),
      data,
    });
  },
};
