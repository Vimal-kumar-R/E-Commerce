const express= require('express');
const { newOrder, getSingleOrder, myOrders, orders, updateOrder, DeleteOrder } = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRole } = require('../middlewares/authenticate');
const router=express.Router();

router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);
router.route('/myorders').get(isAuthenticatedUser,myOrders);

//Admin Routes
router.route('/orders').get(isAuthenticatedUser,authorizeRole('admin'),orders);
router.route('/order/:id').put(isAuthenticatedUser,authorizeRole('admin'),updateOrder)
                          .delete(isAuthenticatedUser,authorizeRole('admin'),DeleteOrder);
module.exports = router;
