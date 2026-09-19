const express = require("express")
const { createTripPlan }= require("../controllers/tripController.js")

const tripRouter = express.Router()
tripRouter.route("/").post(createTripPlan)

module.exports = tripRouter