
const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainControllers.js');  
const adminController = require('../controllers/adminController.js'); 
const foodController = require('../controllers/foodController.js');   
const { login, verify, verifyAdmin } = require('../auth/auth');       

// Landing and authentication routes
router.get('/', mainController.landing_page);
router.get('/login', mainController.show_login);
router.post('/login', login, mainController.handle_login);
router.get('/register', mainController.show_register_page);
router.post('/register', mainController.post_new_user);
router.get('/logout', mainController.logout);

// Food-related routes
router.get('/foods', verify, foodController.showAvailableItems);
router.get('/food/add', verify, (req, res) => {
    res.render('addFoodItem', { title: "Add New Food Item" });
});
router.post('/food/select/:id', verify, foodController.selectItem);
router.post('/food/add', verify, foodController.addFoodItem);
router.get('/food/post', verify, (req, res) => {
    res.render('postFoodItem', { title: "Post New Food Item" });
  });
// Admin-specific routes
router.get('/admin/users', verifyAdmin, adminController.viewUsers);

router.get('/admin/dashboard', verifyAdmin, adminController.dashboard);
router.post('/admin/deleteuser/:id', verifyAdmin, adminController.deleteUser);
router.post('/admin/deletefood/:id', verifyAdmin, foodController.deleteFoodItem);

module.exports = router;
