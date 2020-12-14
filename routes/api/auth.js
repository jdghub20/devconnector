const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const user = require('../../models/User');

// @route       GET api/auth
// @desc        Test route
// @access      Public

router.get('/', auth, async (req, res) => {
    //res.send('Auth route')
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       POST api/users
// @desc        Register user & get Token
// @access      Public

router.post('/', [
    // check('name',
    //     'Name is required')
    //     .not()
    //     .isEmpty(),
    check('email',
        'Please include a valid email')
        .isEmail(),
    check('password',
        'Password is required')
        .exists()
],
    async (req, res) => {
        const errors = validationResult(req);
        // if error then bad request -- 400
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // See if user exists
            let user = await User.findOne({ email });

            if (!user) {
                return res
                    .status(400)
                    .json({
                        errors: [{ msg: 'Invalid Credentials' }]
                    });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({
                        errors: [{ msg: 'Invalid Credentials' }]
                    });
            }

            // Return jsonwebtoken
            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },   // change it to 3600 in production
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                });
            //res.send('User registered');

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');

        }



    });

module.exports = router;
