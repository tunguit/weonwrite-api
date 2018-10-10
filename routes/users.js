const express = require('express');
const router = express.Router();
const config = require("../configs/apiconfig");
const User = require('./../models/User');
const UserAuthentication = require("../models/UserAuthenticationModel");
const UserActionModel = require("../models/UserActionModel");
const passwordHash = require('password-hash');
const uuid = require("uuid");
const _ = require("lodash");
const jwt = require('jsonwebtoken');
const formatResponse = require("../configs/formatReponse");
const UsermodelAction = require("../modelActions/UsermodelAction");

const UserSignUp = (requestBody, customerId, next, res) => {
    const user = new User();
    const userAuthentication = new UserAuthentication();
    const userAction = defaultCustomerAction(customerId);

    user.user_id = customerId;
    userAuthentication.user_id = customerId;
    userAuthentication.email = user.email;
    user.email = requestBody.email;
    user.fullname = requestBody.fullname;
    userAuthentication.email = requestBody.email;
    userAuthentication.password = requestBody.password;

    user.save((userError, userData) => {
        if (userError) {
            deleteAllFailedCustomerDocuments(customerId);
            userError.code = 500;
            return next(userError);
        }
        userAuthentication.save((userAuthError, userAuthData) => {
            if (userAuthError) {
                deleteAllFailedCustomerDocuments(customerId);
                userAuthError.code = 500
                return next(userAuthError)
            }
            userAction.save((userActionError, userActionData) => {
                 if (userActionError) {
                    deleteAllFailedCustomerDocuments(customerId)
                    userActionError.code = 500
                    return next(userActionError)
                }
                const formatted = formatResponse(
                    true,
                    'You have successfully registered your account.',
                    Object.assign(
                        userData.toObject(),
                        userAuthData.toObject(),
                        userActionData.toObject())
                );
                res.json(formatted);
            });
        });
    });
};

const defaultCustomerAction = customerId => {
    const user = new UserActionModel();
    user.user_id = customerId;
    user.followed_questions = [];
    user.saved_news = [];
    user.saved_categories = [];

    return user;
}

const deleteAllFailedCustomerDocuments = (user_id) => {
    User.remove({
        user_id
    }, (err) => { })

    UserAuthentication.remove({
        user_id
    }, (err) => { })
    UserActionModel.remove({
        user_id
    }, (err) => { })
}

router.get('/', function(req, res, next) {
    res.send("OK");
});

router.post('/add-user', function(req, res, next) {
    const requestBody = req.body;
    const customerId = uuid.v1();
    UserSignUp(requestBody, customerId, next, res);
});

router.post("/signin", (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    UserAuthentication.findOne({
        email
    },
        (error, userAuthentication) => {
            if (error) {
                error.code = 500;
                return next(error);
            }

            if (!userAuthentication) {
                const error = new Error("Incorrect email or password")
                error.code = 400;
                return next(error);
            } else {
                if (userAuthentication.password
                    // passwordHash.verify(
                    //     password.toString(),
                    //     userAuthentication.password
                    // )
                ) {
                    // Get user info, then returns more data to client
                    User.findOne({
                        user_id: userAuthentication.user_id
                    },
                        (err, userObj) => {
                            if (!userObj) {
                                const err = new Error("An error occurred during the login process. Please log in again later!")
                                err.code = 400;
                                return next(err);
                            } else {
                                const userAuthenticationObj = userAuthentication.toObject();
                                var token = jwt.sign(
                                    userAuthenticationObj,
                                    'secret', {
                                        expiresIn: "1d"
                                    }
                                );
                                // Get user actions
                                UsermodelAction
                                    .getCustomerActions({
                                        user_id: userObj.user_id
                                    })
                                    .then(userActionData => {
                                        let user = {}
                                        if (userActionData) {
                                            user = _.merge(
                                                userAuthentication.toObject(),
                                                userObj.toObject(),
                                                userActionData.toObject()
                                            )
                                        } else {
                                            user = _.merge(userAuthentication.toObject(), userObj.toObject())
                                        }
                                        let response = formatResponse(true, "Token", {
                                            token,
                                            expired: "1 day",
                                            user
                                        });
                                        return res.json(response);
                                    });
                            }
                        }
                    )

                } else {
                    const error = new Error("Email or password is incorrect.")
                    error.code = 400;
                    return next(error);
                }
            }
        }
    );
});


module.exports = router;
