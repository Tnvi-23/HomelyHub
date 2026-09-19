const express = require("express")
const bookingRouter = express.Router()

const {createOrder , verifyPayment , getuserBookings , getBookingDetails} = require("../controllers/bookingController")
const {protect} = require("../controllers/authController")

bookingRouter.get("/" , protect , getuserBookings)
bookingRouter.get("/:bookingId" , protect , getBookingDetails)

bookingRouter.post("/create-order" , protect , createOrder)
bookingRouter.post("/verify-payment" , protect , verifyPayment)

module.exports = bookingRouter