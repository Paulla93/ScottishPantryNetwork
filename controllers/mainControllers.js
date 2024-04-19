
const userDao = require("../models/userModel.js");

exports.show_login = function (req, res) {
    res.render("user/login");
};

exports.handle_login = function (req, res) {
    res.redirect("/foods"); // Redirect to the food items page after login
};



exports.landing_page = function (req, res) {
    // Example data to display on the landing page
    const pageData = {
        
        user: req.user
    };
    res.render("landingPage", pageData);  
};

exports.show_register_page = function (req, res) {
    res.render("user/register");
};

exports.post_new_user = function (req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(401).send("No username or password provided");
        return;
    }
    userDao.lookup(username, function (err, user) {
        if (user) {
            res.status(409).send("User already exists");
            return;
        }
        userDao.create(username, password);
        res.redirect("/login");
    });
};

exports.logout = function (req, res) {
    res.clearCookie("jwt").status(200).redirect("/");
};
