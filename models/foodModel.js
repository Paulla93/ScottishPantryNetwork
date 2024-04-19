const Datastore = require("nedb");

class FoodModel {
    constructor(dbFilePath) {
        this.db = new Datastore({ filename: dbFilePath, autoload: true });
    }

   

    getAvailableItems() {
        return new Promise((resolve, reject) => {
            const today = new Date().toISOString().split('T')[0];
            this.db.find({ dateExpire: { $gte: today }, isSelected: false }, function(err, items) {
                if (err) reject(err);
                else resolve(items);
            });
        });
    }
    addFoodItem(item) {
        return new Promise((resolve, reject) => {
            this.db.insert(item, function(err, newDoc) {
                if (err) {
                    reject(err);
                } else {
                    resolve(newDoc);
                }
            });
        });
    }
    getAllFoodItems() {
        return new Promise((resolve, reject) => {
            this.db.find({}, (err, items) => {
                if (err) reject(err);
                else resolve(items);
            });
        });
    }

    selectItem(id) {
        return new Promise((resolve, reject) => {
            this.db.update({ _id: id }, { $set: { isSelected: true } }, {}, (err, numUpdated) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(numUpdated);
                }
            });
        });
    }

    deleteFoodItem(id) {
        return new Promise((resolve, reject) => {
            this.db.remove({ _id: id }, {}, (err, numRemoved) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(numRemoved);
                }
            });
        });
    }
}




module.exports = new FoodModel('./data/food.db');