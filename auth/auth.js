const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.login = function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    userModel.lookup(username, function (err, user) {
        if (err) {
            console.log("Error looking up user", err);
            return res.status(500).send("Internal Server Error");
        }
        if (!user) {
            console.log("User ", username, " not found");
            return res.status(404).render("user/login", { message: "User not found, please register first." });
        }
        // Compare provided password with stored password
        bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
                console.log("Error comparing passwords", err);
                return res.status(500).send("Error during login process");
            }
            if (result) {
                // Use the payload to store information about the user such as username and admin status.
                let payload = {
                    username: username,
                    admin: user.isAdmin  // Include admin status in the payload
                };
                // Create the access token with an expiry of 1 hour
                let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
                res.cookie("jwt", accessToken);
               
                res.redirect(user.isAdmin ? '/admin/dashboard' : '/foods');
            } else {
                console.log("Invalid password");
                return res.status(401).render("user/login", { message: "Invalid password. Please try again." });
            }
        });
    });
};
exports.verifyAdmin = function(req, res, next) {
    if (!req.user || !req.user.admin) {
        return res.status(403).send('Access denied. Admins only.');
    }
    next();
};
exports.verify = function (req, res, next) {
    let accessToken = req.cookies.jwt;
    if (!accessToken) {
        return res.status(403).render("user/login", { message: "No access token provided. Please log in." });
    }
    try {
        let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = payload;  
        next();
    } catch (e) {
        console.log("Token verification failed", e);
        return res.status(401).render("user/login", { message: "Session expired. Please log in again." });
    }
};

exports.verifyAdmin = function(req, res, next) {
    exports.verify(req, res, function() {
        if (req.user && req.user.admin) {
            next();
        } else {
            res.status(401).send('Access denied: Admins only');
        }
    });
};