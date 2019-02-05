const { date2str } = require('../../../utils/date');
const { Event, User } = require('../../../db/models');

const DataLoader = require('dataloader');

// batching-cache loaders
const eventLoader = new DataLoader(eventIds => {
    if (eventIds.length === 1) {
        // we always have to return a Promise<Array<value>>, so make the artificial array
        return Promise.all([Event.findById(eventIds[0]).exec()]);
    }
    const events = Event.find({ _id: { $in: eventIds } }).exec();
    return events;
});
const userLoader = new DataLoader(userIds => {
    if (userIds.length === 1) {
        // we always have to return a Promise<Array<value>>, so make the artificial array
        return Promise.all([User.findById(userIds[0]).exec()]);
    }
    return User.find({ _id: { $in: userIds } }).exec();
});

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

const fixMongoUser = (obj) => {
    const user = fixMongoObj(obj);

    // never return the password to clients - always return null
    user.password = null;

    // populate the 'events' manually (from array of Mongo.ObjectId to array of Event)
    user.events = populateEvents(user.events);

    return user;
};

const fixMongoEvent = (obj) => {
    const event = fixMongoObj(obj);
    // convert the Date type in Mongo to more readable date String
    // in Mongo the Date is then returned as (getTime() string like 1546249685562)
    event.date = date2str(event.date);

    // populate the 'creator' manually (from Mongo.ObjectId to User)
    event.creator = populateUser(event.creator);

    return event;
};

/**
 * 
 * @param {String[]}
 * @return {Function{String[] => Promise<Event[]>}}
 */
const populateEvents = (eventIds) => {
    // convert the array of Mongo.ObjectId  to an array of Event
    // NOTE - don't execute the function as it enter an infinite loop
    // as the 'getEventsByIds' will also execute 'getUserById',
    // But GraphQL can determine if we return a value or a function 
    // and will execute it if necessary
    // return getEventsByIds(eventIds);
    return getEventsByIds.bind(null, eventIds);
};

/**
 * 
 * @param {String}
 * @return {Function{String[] => Promise<Event>}} resolving function
 */
const populateEvent = (eventId) => {
    return getEventById.bind(null, eventId);
};

/**
 * 
 * @param {String} userId
 * @return {Function{String => Promise<User>}}
 */
const populateUser = (userId) => {
    // convert the array of Mongo.ObjectId  to an array of Event
    // NOTE - don't execute the function as it enter an infinite loop
    // as the 'getUserById' will also execute 'getEventsByIds',
    // But GraphQL can determine if we return a value or a function 
    // and will execute it if necessary
    // return getUserById(userId);
    return getUserById.bind(null, userId);
};

/**
 * 
 * @param {String[]} eventIds 
 * @return {Promise<User>}
 */
const getEventsByIds = (eventIds) => {
    // using the batch-cache loader
    const events = eventLoader.loadMany(eventIds);
    // // using plain Mongoose request
    // const events = Event.find({ _id: { $in: eventIds } }).exec();

    return events.then(arr => arr.map(obj => fixMongoEvent(obj)));
};

/**
 * 
 * @param {String} eventId 
 * @return {Promise<Event>}
 */
const getEventById = (eventId) => {
    // using the batch-cache loader
    const event = eventLoader.load(eventId);
    // // using plain Mongoose request
    // const user =  Event.findById(eventId).exec();


    // // using plain Mongoose request
    return event.then(fixMongoEvent);
};

/**
 * 
 * @param {String} userId 
 * @return {Promise<User>}
 */
const getUserById = (userId) => {
    // using the batch-cache loader
    const user = userLoader.load(userId);
    // // using plain Mongoose request
    // const user = User.findById(userId).exec();

    return user.then(fixMongoUser);
};

module.exports = {
    fixMongoObj,
    fixMongoUser,
    fixMongoEvent,

    populateEvent,
    populateEvents,
    populateUser,
};