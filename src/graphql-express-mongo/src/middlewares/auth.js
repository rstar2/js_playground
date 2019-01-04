const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const auth = (req, res, next) => {
    // NOTE: in this middleware don't thow error but just add the "auth" metadata


    // const token = req.headers['x-access-token']; // the JWT token itself
    // if (!token) {
    //     // res.status(403).send({ auth: false, message: 'No token provided.' });
    //     // return;
    //     req.auth = false;
    //     return next();
    // }

    const authHeader = req.get('Authorization'); // like "Bearer ASDADASDASDASDAS"
    if (!authHeader) {
        // res.status(403).send({ auth: false, message: 'No token provided.' });
        // return;
        req.auth = false;
        return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        // res.status(403).send({ auth: false, message: 'No token provided.' });
        // return;
        req.auth = false;
        return next();
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            // res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            // return;
            req.auth = false;
            return next();
        }

        // if everything good, save to request for use in other routes
        req.auth = true;
        req.userId = decoded.id;
        next();
    });
};

module.exports = auth;