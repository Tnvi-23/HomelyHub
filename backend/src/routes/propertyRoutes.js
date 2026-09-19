const {getProperties , getProperty}= require("../controllers/propertyController")
const express = require("express")

const propertyRouter = express.Router()

propertyRouter.route("/").get(getProperties)
propertyRouter.route("/:id").get(getProperty)

module.exports = propertyRouter