const property = require("../models/propertyModel")
const Booking = require("../models/bookingModel")

const createOrder = async(req,res) => {
    const {amount , propertyId , fromDate , toDate , guests} = req.body

    const booking = await Booking.create({
      property: propertyId,
      user: req.user._id,   // protect middleware se user attach hota hai
      price: amount,
      fromDate,
      toDate,
      guests,
      numberOfNights: Math.ceil(
        (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)
      )
    });

    const orderId = "order_" + Date.now()
    res.json({
        success : true,
        message : "The order created successfully",
        orderId,
        amount,
        propertyId,
        fromDate,
        toDate,
        guests
    })
}

const verifyPayment = async(req,res) => {
    const {orderId , bookingDetails , forceStatus} = req.body;

    if(forceStatus === "success"){
        const paymentId = "pay_" + Date.now()
        const newBooking = await Booking.create({
            user : req.user._id,
            property : bookingDetails.propertyId,
            price : bookingDetails.price,
            fromDate : bookingDetails.fromDate,
            toDate : bookingDetails.toDate,
            guests : bookingDetails.guests,
            numberOfnights : bookingDetails.nights,
            paid : true
        })

        const updatedProperty = await property.findByIdAndUpdate(
            bookingDetails.propertyId,{
                $push :{
                    currentBookings : {
                        bookingId : newBooking._id,
                        fromDate : bookingDetails.fromDate,
                        toDate : bookingDetails.toDate,
                        userId : req.user._id
                    }
                }
            },
            {new:true}
        )
        res.json({
            success : true ,
            message : "Booking is confirmed",
            paymentId,
            orderId,
            booking : newBooking
        })
    }else{
        res.status(400).json({
            success : false,
            message : "Payment failed",
            orderId
        })
    }
}

const getuserBookings = async(req,res) => {
    try{
        const bookings = await Booking.find({user :req.user._id})

        res.status(200).json({
            status : "success",
            data : {
                bookings
            }
        })
    }catch(err){
        res.status(400).json({
            status : "fail",
            message : err.message
        })
    }
}

const getBookingDetails = async(req,res) => {
    try{
        const bookings = await Booking.findById(req.params.bookingId)

        res.status(200).json({
            status : "success",
            data : {
                bookings
            }
        })    

    }catch(err){
        res.status(400).json({
            status : "fail",
            message : err.message
        })
    }
}

module.exports = {createOrder , verifyPayment , getuserBookings , getBookingDetails}