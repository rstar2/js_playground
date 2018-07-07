const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

const secret = process.env.JWT_SECRET;

const router = express.Router();
router.post('/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    if (!email || !password || !name)
        return res.status(500).send('No email/password/name provided.');

    const hashedPassword = bcrypt.hashSync(password, 8);

    User.create({
        name: name,
        email: email,
        password: hashedPassword
    }, (err, user) => {
        if (err) return res.status(500).send('There was a problem registering the user.');

        // create a token
        const token = jwt.sign({ id: user._id }, secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({ auth: true, token: token });
    });
});

router.post('/login', function (req, res) {

    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        const token = jwt.sign({ id: user._id }, secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({ auth: true, token: token });
    });

});

// not needed as the client should just remove its stored JWT
router.get('/logout', (req, res) => {
    res.status(200).send({ auth: false, token: null });
});

module.exports = router;