const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true,
        maxlength: [100, "Product name cannot exceed 100 characters"]
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            image: {
                type: String,
                required: [true, "Please upload product image"]
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter product category"],
        enum: {
            values: [
                'Electronics',
                'Mobile Phones',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes',
                'Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message: "Please select correct category"
        }
    },
    seller: {
        type: String,
        required: [true, "Please enter product seller"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        default: 0
    },
    numOfReviews: { 
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', 
                required: true
            },
            rating: {
                type: Number, 
                required: [true, "Please enter your rating"]
            },
            comment: {
                type: String,
                required: [true, "Please enter your comment"]
            }
        }
    ],
    userP: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model for the product creator or owner
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;

