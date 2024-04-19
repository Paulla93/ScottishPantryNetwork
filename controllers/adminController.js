const userModel = require('../models/userModel');
const foodModel = require('../models/foodModel'); 


exports.viewUsers = function(req, res) {
    userModel.getAllUsers().then(users => {
        res.render('viewUsers', { users });
    }).catch(err => {
        console.error("Error retrieving users:", err);
        res.status(500).send(err.toString());
    });
};
exports.dashboard = function(req, res) {
    userModel.getAllUsers((err, users) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).send("Error fetching users.");
        }
        foodModel.getAllFoodItems().then(foodItems => {
            res.render('adminDashboard', {
                title: 'Admin Dashboard',
                user: req.user,
                users: users,
                foodItems: foodItems
            });
        }).catch(err => {
            console.error("Error fetching food items:", err);
            res.status(500).send("Error fetching food items.");
        });
    });
};
// Deletes a user
exports.deleteUser = function(req, res) {
    const userId = req.params.id;
    userModel.deleteUser(userId, (err) => {
        if (err) {
            console.error("Failed to delete user:", err);
            return res.status(500).send("Failed to delete user.");
        }
        res.redirect('/admin/dashboard');
    });
};

