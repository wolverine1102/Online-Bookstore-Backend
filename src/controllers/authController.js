const _ = require('lodash');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const token = require('../middlewares/token');

const validateUser = async function (password, hash) {
    await bcrypt.compare(password, hash)
        .then((result) => {
            return result;
        })
        .catch((error) => {
            console.log(error);
        })
}

const register = async function (req, res) {
    try {
        let errors = {};
        const { email, name, password } = req.body;

        ['email', 'password'].forEach(key => {
            if (req.body[key] === null || req.body[key] === undefined) {
                errors[key] = `${key} is a required parameter`;
            }
            else if (req.body[key] === "") {
                errors[key] = `${key} cannot be empty`;
            }
        });

        if (_.keys(errors).length > 0) {
            res.status(400).json(errors);
            return;
        }

        await User.findOne({ email: email })
            .then(async (user) => {
                if (user) {
                    res.status(400).json({
                        message: "User already exists"
                    });
                }
                else {
                    const hashedPassword = await bcrypt.hash(password, 10);

                    const newUser = new User({
                        email,
                        name,
                        password: hashedPassword
                    })

                    await newUser.save();

                    const userId = newUser._id.toJSON();

                    res.status(200).json({
                        success: true,
                        data: {
                            email: newUser.email,
                            phone: newUser.phone,
                            token: token.generateAccessToken(userId)
                        }
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

const login = async function (req, res) {
    try {
        let errors = {};
        const { email, password } = req.body;

        ['email', 'password'].forEach(key => {
            if (req.body[key] === null || req.body[key] === undefined) {
                errors[key] = `${key} is a required parameter`;
            }
            else if (req.body[key] === "") {
                errors[key] = `${key} cannot be empty`;
            }
        });

        if (_.keys(errors).length > 0) {
            res.status(400).json(errors);
            return;
        }

        await User.findOne({ email: email })
            .then((user) => {
                if (user) {
                    if (validateUser(password, user.password)) {
                        res.status(200).json({
                            success: true,
                            data: {
                                email: user.email,
                                token: token.generateAccessToken(user._id.toJSON())
                            }
                        });
                    }
                    else {
                        res.status(401).json({
                            message: "Incorrect Credentials"
                        });
                    }
                }
                else {
                    res.status(401).json({
                        message: "Incorrect Credentials"
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

module.exports = {
    register,
    login
};