const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event' // the name of the model
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // the name of the model
    },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;