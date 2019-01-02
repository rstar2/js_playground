const { date2str } = require('../../../utils/date');
const { Event, User } = require('../../../db/models');


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

    console.log('event.creator', event.creator);


    // populate the 'creator' manually (from Mongo.ObjectId to User)
    event.creator = populateUser(event.creator);

    return event;
};

/**
 * 
 * @param {String[]}
 * @return {Function{String => Promise<Event[]>}}
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
 * @param {String} userId 
 * @return {Promise<User>}
 */
const getEventsByIds = (eventIds) => {
    return Event.find({ _id: { $in: eventIds } }).exec()
        .then(arr => arr.map(obj => fixMongoEvent(obj)));
};

/**
 * 
 * @param {String} eventId 
 * @return {Promise<Event>}
 */
const getEventById = (userId) => {
    return Event.findById(userId).exec()
        .then(fixMongoEvent);
};

/**
 * 
 * @param {String} userId 
 * @return {Promise<User>}
 */
const getUserById = (userId) => {
    return User.findById(userId).exec()
        .then(fixMongoUser);
};

module.exports = {
    fixMongoObj,
    fixMongoUser,
    fixMongoEvent,

    populateEvent,
    populateEvents,
    populateUser,
};