// routes/product.js

const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview } = require('../controllers/productController.js'); // Correct import
const router = express.Router();
const {isAuthenticatedUser, authorizeRole }= require('../middlewares/authenticate.js');
router.route('/products').get( getProducts); // Use getProducts

router.route('/product/:id')
                 .get(getSingleProduct)  // get a single product
                 .put(updateProduct)     //  update a product
                 .delete(deleteProduct)  //deleted product

router.route('/review').put(isAuthenticatedUser, createReview)    
                       .delete(deleteReview)
router.route('/reviews').get(getReviews)


router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRole('admin',''), newProduct); // create newProduct                 
module.exports = router;
