const { date2str } = require('../../../utils/date');
const { Event, User } = require('../../../db/models');

const DataLoader = require('dataloader');

/**
 * 
 * @param {Mongo.ObjectID} id 
 */
const cacheKeyFn = (id) => {
    if (false === id instanceof String) {
        id = id.toString();
    }
    return id;
};


// Sort by the passed array od MongoDB ID objects
/**
 * Sorting function. Should be used for array with results from MongoDb.find({ _id: { $in: ids } })
 * @param {Mongo.ObjectID[]} ids 
 */
const sortByIndex = ids => (a, b) => {
    // Note a and B ar Mongo.Model objects and they have "_id" prop which is of type Mongo.ObjectID
    // but plain simple "ids.indexOf(a._id)" will always be -1 as "a._id != ids[0]" (or any other index)
    // but "a._id.equals(ids[0])" for some index
    return ids.findIndex(id => a._id.equals(id)) - ids.findIndex(id => b._id.equals(id));
};


// batching-cache loaders
const eventLoader = new DataLoader(eventIds => {
    if (eventIds.length === 1) {
        // we always have to return a Promise<Array<value>>, so make the artificial array
        return Promise.all([Event.findById(eventIds[0]).exec()]);
    }
    return Event.find({ _id: { $in: eventIds } }).exec()
        .then(events => {
            // MongoDB does not guarantee the order of the result array to match the order of the input ids
            // BUT this is vital to DataLoader in order to map the batched result
            events.sort(sortByIndex(eventIds));
            return events;
        });
}, { cacheKeyFn });
const userLoader = new DataLoader(userIds => {
    if (userIds.length === 1) {
        // we always have to return a Promise<Array<value>>, so make the artificial array
        return Promise.all([User.findById(userIds[0]).exec()]);
    }
    return User.find({ _id: { $in: userIds } }).exec()
        .then(users => {
            // MongoDB does not guarantee the order of the result array to match the order of the input ids
            // BUT this is vital to DataLoader in order to map the batched result
            users.sort(sortByIndex(userIds));
            return users;
        });
}, { cacheKeyFn });

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

    // populate the 'events' manually (from array of Mongo.ObjectID to array of Event)
    user.events = populateEvents(user.events);

    return user;
};

const fixMongoEvent = (obj) => {
    const event = fixMongoObj(obj);
    // convert the Date type in Mongo to more readable date String
    // in Mongo the Date is then returned as (getTime() string like 1546249685562)
    event.date = date2str(event.date);

    // populate the 'creator' manually (from Mongo.ObjectID to User)
    event.creator = populateUser(event.creator);

    return event;
};

/**
 * 
 * @param {Mongo.ObjectID[]} eventIds
 * @return {Function{String[] => Promise<Event[]>}}
 */
const populateEvents = (eventIds) => {
    // convert the array of Mongo.ObjectID to an array of Event

    // NOTE - don't execute the function as it enter an infinite loop
    // as the 'getEventsByIds' will also execute 'getUserById',
    // But GraphQL can determine if we return a value or a function 
    // and will execute it if necessary
    // return getEventsByIds(eventIds);
    return getEventsByIds.bind(null, eventIds);
};

/**
 * 
 * @param {Mongo.ObjectID} eventId
 * @return {Function{String[] => Promise<Event>}} resolving function
 */
const populateEvent = (eventId) => {
    return getEventById.bind(null, eventId);
};

/**
 * 
 * @param {Mongo.ObjectID} userId
 * @return {Function{String => Promise<User>}}
 */
const populateUser = (userId) => {
    // convert the Mongo.ObjectID to a User

    // NOTE - don't execute the function as it enter an infinite loop
    // as the 'getUserById' will also execute 'getEventsByIds',
    // But GraphQL can determine if we return a value or a function 
    // and will execute it if necessary
    // return getUserById(userId);
    return getUserById.bind(null, userId);
};

/**
 * 
 * @param {Mongo.ObjectID[]} eventIds 
 * @return {Promise<Event>}
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
 * @param {Mongo.ObjectID} eventId 
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
 * @param {Mongo.ObjectID} userId 
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