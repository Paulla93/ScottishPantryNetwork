const foodModel = require('../models/foodModel');  



exports.showAvailableItems = function(req, res) {
    foodModel.getAvailableItems().then(items => {
        res.render('foodList', { items: items, user: req.user });
    }).catch(err => {
        console.error("Error retrieving food items:", err);
        res.status(500).send(err.toString());
    });
};
exports.getAllFoodItems = function(callback) {
    db.find({}, (err, items) => {
        if (err) {
            console.error("Failed to retrieve food items:", err);
            callback(err, null);
        } else {
            callback(null, items);
        }
    });
};
// Add a new food item
exports.addFoodItem = function(req, res) {
    const { name, dateExpire } = req.body;
    foodModel.addFoodItem({ name, dateExpire, isSelected: false }).then(() => {
        res.redirect('/foods');  
    }).catch(err => {
        console.error("Error adding food item:", err);
        res.status(500).send(err.toString());
    });
};





exports.addFoodItem = function(req, res) {
    const { name, dateExpire } = req.body;
    foodModel.addFoodItem({ name, dateExpire, isSelected: false })
        .then(() => {
            res.redirect('/foods');  
        })
        .catch(err => {
            console.error("Error adding food item:", err);
            res.status(500).send(err.toString());
        });
};
exports.deleteFoodItem = function(req, res) {
    if (!req.user || !req.user.admin) {
        return res.status(403).send("Access Denied: Admins only.");
    }
    const id = req.params.id;
    foodModel.deleteFoodItem(id)
        .then(() => {
            res.redirect('/admin/dashboard');  
        })
        .catch(err => {
            console.error("Error deleting food item:", err);
            res.status(500).send("Failed to delete item");
        });
};