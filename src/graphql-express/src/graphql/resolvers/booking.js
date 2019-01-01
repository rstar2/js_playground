const { fixMongoObj, fixMongoEvent, populateUser, populateEvent } = require('./helpers');
const { date2str } = require('../../utils/date');
const { Booking, Event, User } = require('../../db/models');


const fixMongoBooking = (obj) => {
    const booking = fixMongoObj(obj);

    booking.createdAt = date2str(booking.createdAt);
    booking.updatedAt = date2str(booking.updatedAt);

    // populate/resolve relations
    booking.user = populateUser(booking.user);
    booking.event = populateEvent(booking.event);

    return booking;
};

module.exports = {
    async bookings() {
        let bookings = await Booking.find().exec();
        bookings = bookings.map(fixMongoBooking);

        return bookings;
    },

    async createBooking(args) {
        const { eventId, userId } = args;

        const user = await User.findById(userId);
        if (!user) throw new Error('User does not exist');

        const event = await Event.findById(eventId);
        if (!event) throw new Error('Event does not exist');


        let booking = new Booking({ eventId, userId });
        booking = await booking.save();
        booking = fixMongoBooking(booking);

        return booking;
    },

    async cancelBooking(args) {
        const { bookingId } = args;

        const booking = await Booking.findById(bookingId).populate('event');
        booking.remove();
        // the same
        // await Booking.deleteOne({ _id: bookingId });

        let event = booking.event;
        event = fixMongoEvent(event);

        return event;
    },
};