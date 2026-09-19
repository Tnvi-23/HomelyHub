const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.ObjectId,
        ref: "property",
        required: [true, "Booking must belong to a property"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: [true, "Booking must belong to a user"]
    },
    price: {
        type: Number,
        required: [true, "Booking must have a price"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    paid: {
        type: Boolean,
        default: true
    },
    fromDate: Date,
    toDate: Date,
    guests: Number,
    numberOfNights: Number
}, { timestamps: true });

bookingSchema.pre(/^find/, function() {
    this.populate("user")
        .populate({
            path: "property",
            select: "maximumGuest images properName address"
        });
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;