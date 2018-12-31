const { hash } = require('../../utils/hash');

const { Event, User, Booking } = require('../../db/models');

/**
 * 
 * @param {Object} obj
 * @return {Object} object with "fixed" Mongo ObjectID type converted to String
 */
const fixMongoObj = (obj) => {
    // the Mongoose found/saved object has metadata attached so just get the document
    // convert the Mongo ObjectID type to plain String so GraphQL can return it
    return {
        ...obj._doc,
        _id: obj._doc._id.toString()
    };
};

const fixMongoEvent = (obj) => {
    const event = fixMongoObj(obj);
    // convert the Date type in Mongo to more readable date String
    // in Mongo the Date is then returned as (getTime() string like 1546249685562)
    event.date = new Date(event.date).toISOString();
    return event;
};

const fixMongoUser = (obj) => {
    const user = fixMongoObj(obj);
    // never return the password to clients - always return null
    user.password = null;
    return user;
};

const fixMongoBooking = (obj) => {
    const booking = fixMongoObj(obj);
    booking.createdAt = new Date(booking.createdAt).toISOString();
    booking.updatedAt = new Date(booking.updatedAt).toISOString();
    return booking;
};

/**
 * 
 * @param {User} user
 * @return {User} same "fixed" user
 */
const populateUserEvents = (user) => {
    // populate the 'events' manually (from array of Mongo.ObjectId to array of Event)

    // convert the array of Mongo.ObjectId  to an array of Event
    // NOTE - don't execute the function as it enter an infinite loop
    // as the 'getEventsByIds' will also execute 'getUserById',
    // But GraphQL can determine if we return a value or a function 
    // and will execute it if necessary
    // user.events = getEventsByIds(user.events);
    user.events = getEventsByIds.bind(null, user.events);

    return user;
};

/**
 * 
 * @param {Event} event
 * @return {Event} same "fixed" event 
 */
const populateEventCreator = (event) => {
    // populate the 'creator' manually (from Mongo.ObjectId to User)

    // convert the array of Mongo.ObjectId  to an array of Event
    // NOTE - don't execute the function as it enter an infinite loop
    // as the 'getUserById' will also execute 'getEventsByIds',
    // But GraphQL can determine if we return a value or a function 
    // and will execute it if necessary
    // event.creator = getUserById(event.creator);
    event.creator = getUserById.bind(null, event.creator);

    return event;
};

/**
 * 
 * @param {String} userId 
 * @return {Promise<User>}
 */
const getEventsByIds = (eventIds) => {
    return Event.find({ _id: { $in: eventIds } }).exec()
        .then(arr => arr.map(obj => {
            const event = fixMongoEvent(obj);
            return populateEventCreator(event);
        }));
};

/**
 * 
 * @param {String} userId 
 * @return {Promise<User>}
 */
const getUserById = (userId) => {
    return User.findById(userId).exec()
        .then(fixMongoUser)
        .then(populateUserEvents);
};



module.exports = {
    // just a simple demo
    items() {
        return ['Test1', 'Test2', 'Test3'];
    },
    createItem(args) {
        return args.name;
    },

    // real resolvers

    // return a Promise
    events() {
        // // populate the 'creator' reference field
        // return Event.find().populate('creator').exec()
        //     .then(arr => arr.map(getMongoObj));

        // populating will work only for the 'creator' field,
        // but as populated User object will its "events" field will still not be populated

        // so different approach:
        return Event.find().exec()
            .then(arr => arr.map(obj => {
                const event = fixMongoEvent(obj);
                // populate the 'creator' manually (from Mongo.ObjectId to User)
                return populateEventCreator(event);
            }));

    },
    // return a Promise - work with async/await 
    async createEvent(args) {
        const { title, description, price, date, creator } = args.input;

        const user = await User.findById(creator);
        if (!user) throw new Error('User does not exist');

        const event = new Event({
            title: title,
            description: description,
            price: +price,
            date: new Date(date),
            creator: creator
        });

        const eventSaved = await event.save()
            .then(fixMongoObj)
            .then(populateEventCreator);

        // also save the event ot the list of event in the user document
        // all these are the same
        user.events.push(eventSaved);
        // user.events.push(eventSaved._id);
        // user.events.push(event);
        // user.events.push(event.id);   // here it is still 'id' property not the later saved '_id'
        await user.save();

        return eventSaved;
    },

    createUser(args) {
        const { email, password } = args.input;

        // check if email is taken first
        return User.findOne({ email })
            .then(user => {
                if (user) throw new Error('User exists');

                // no such user - so continue with first hashing the password
                return hash(password);
            })
            .then(password => new User({ email, password }))
            .then(user => user.save())
            .then(fixMongoUser)
            .then(populateUserEvents);
    },

    async bookings() {
        let bookings = await Booking.find().exec();
        bookings = bookings.map(fixMongoBooking);

        return bookings;
    },

    async createBooking(args) {
        const { eventId, userId } = args;
        let booking = new Booking({ eventId, userId });
        booking = await booking.save();
        booking = fixMongoBooking(booking);

        return booking;
    },

    cancelBooking(args) {
        const { bookingId } = args;

    }
};