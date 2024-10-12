const connectDatabase = require('../config/database.js');
const products = require('../data/product.json');
const Product =require('../models/productModel.js');
const dotenv = require('dotenv');

dotenv.config({path:'backend/config/.env'});
connectDatabase();

const seedProduct = async ()=>{
 try{
    await Product.deleteMany();
    console.log('Products deleted!')
    await Product.insertMany(products);
    console.log('All products added!');
 }catch(error){
        console.log(error.message);
    }
    process.exit();
}

seedProduct();