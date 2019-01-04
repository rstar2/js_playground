const { fixMongoObj, fixMongoEvent, populateUser, populateEvent,
    checkAuth } = require('./helpers');
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
    /**
     * @param {Object} args 
     * @param {Request} req 
     */
    async bookings(args, req) {
        checkAuth(req);

        let bookings = await Booking.find().exec();
        bookings = bookings.map(fixMongoBooking);

        return bookings;
    },

    /**
     * @param {Object} args 
     * @param {Request} req 
     */
    async createBooking(args, req) {
        checkAuth(req);

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

    /**
     * @param {Object} args 
     * @param {Request} req 
     */
    async cancelBooking(args, req) {
        checkAuth(req);

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