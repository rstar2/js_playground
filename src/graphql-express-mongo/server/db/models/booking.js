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
}, { 
    // this will create both 'createAt' and 'updatedAt' fields  -both managed by Mongoose
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;