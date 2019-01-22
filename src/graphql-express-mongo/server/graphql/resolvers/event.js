const { fixMongoEvent, checkAuth } = require('./helpers');
const { str2date } = require('../../utils/date');
const { Event, User } = require('../../db/models');


module.exports = {
    // return a Promise

    /**
     */
    events() {
        // // populate the 'creator' reference field
        // return Event.find().populate('creator').exec()
        //     .then(arr => arr.map(getMongoObj));

        // populating will work only for the 'creator' field,
        // but as populated User object will its "events" field will still not be populated

        // so different approach:
        return Event.find().exec()
            .then(arr => arr.map(obj => fixMongoEvent(obj)));

    },

    // return a Promise - work with async/await

    /**
     * @param {Object} args 
     * @param {Request} req 
     */
    async createEvent(args, req) {
        checkAuth(req);

        const { title, description, price, date } = args.input;

        // creator is the authorized user
        const creator = req.userId;
        const user = await User.findById(creator);
        if (!user) throw new Error('User does not exist');

        const event = new Event({
            title: title,
            description: description,
            price: +price,
            date: str2date(date),
            creator: creator
        });

        const eventSaved = await event.save()
            .then(fixMongoEvent);

        // also save the event ot the list of event in the user document
        // all these are the same
        user.events.push(eventSaved);
        // user.events.push(eventSaved._id);
        // user.events.push(event);
        // user.events.push(event.id);   // here it is still 'id' property not the later saved '_id'
        await user.save();

        return eventSaved;
    },
};