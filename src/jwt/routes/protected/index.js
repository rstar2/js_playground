const express = require('express');

const jwtVerify = require('../../middlewares/jwt-verify');
const User = require('../../models/User');

const router = express.Router();


router.get('/me', jwtVerify, (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    // req.userId - comes from the jwtVerify middleware
    User.findById(req.userId,
        { password: 0 }, // projection, will not return the password
        (err, user) => {
            if (err) return res.status(500).send('There was a problem finding the user.');
            if (!user) return res.status(404).send('No user found.');

            res.status(200).send(user);
        });
});

module.exports = router;