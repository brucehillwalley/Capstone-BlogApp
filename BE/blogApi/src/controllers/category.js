"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
// Category Controller:

const Category = require("../models/category");

module.exports = {
    list: async (req, res) => {
        // const data = await Category.find()
        const data = await res.getModelList(Category)
        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Category),
            data: data
        })
    },
    create: async (req, res) => {
        const data = await Category.create(req.body)
        res.status(201).send({
            error: false,
            body: req.body,
            data: data
        })
    },
    read: async (req, res) => {
        const data = await Category.findOne({ _id: req.params.id })
        res.status(202).send({
            error: false,
            data: data
        })
    },
    update: async (req, res) => {
        const data = await Category.updateOne({ _id: req.params.id }, req.body)
        const newdata = await Category.findOne({ _id: req.params.id })
        res.status(202).send({
            error: false,
            body: req.body,
            data: data, // info about update
            // güncel veriyi istiyorsan tekrar çağır
            newdata: newdata
        })
    },
    delete: async (req, res) => {
        const data = await Category.deleteOne({ _id: req.params.id })
        // console.log(data);
        res.sendStatus((data.deletedCount >= 1) ? 204 : 404)
    }
}
