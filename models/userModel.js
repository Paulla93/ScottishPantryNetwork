const Datastore = require("nedb");
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserDAO {
    constructor(dbFilePath) {
        if (dbFilePath) {
          
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
        } else {
           
            this.db = new Datastore();
        }
    }

    
    init() {
        this.create('admin', 'adminpass', true);  // Default admin for demonstration
    }

    // Create a new user with an option to make them an admin
    create(username, password, isAdmin = false) {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                console.error("Error hashing password for user:", err);
                return;
            }
            this.db.insert({
                user: username,
                password: hash,
                isAdmin: isAdmin
            }, (err) => {
                if (err) {
                    console.log("Can't insert user:", username, err);
                } else {
                    console.log("User created successfully:", username);
                }
            });
        });
    }

    lookup(username, callback) {
        this.db.find({ user: username }, (err, entries) => {
            if (err) {
                return callback(err, null);
            }
            if(entries.length === 0) {
                // User not found
                return callback(null, null);
            } else {
                // User found
                return callback(null, entries[0]);
            }
        });
    }
    

    getAllUsers(cb) {
        this.db.find({}, (err, users) => {
            if (err) {
                console.log('Error retrieving all users:', err);
                cb(err, null);
            } else {
                cb(null, users);
            }
        });
    }


    deleteUser(userId, cb) {
        this.db.remove({ _id: userId }, {}, (err, numRemoved) => {
            if (err) {
                console.log('Error deleting user:', err);
                cb(err);
            } else {
                console.log('User deleted successfully');
                cb(null);
            }
        });
    }
}

const dao = new UserDAO('./data/users.db'); 
dao.init();

module.exports = dao;