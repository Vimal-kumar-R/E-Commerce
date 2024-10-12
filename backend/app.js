const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/error.js')
require('dotenv').config({path:__dirname+'/.env'});
const cookieParser = require('cookie-parser')


app.use(express.json());
app.use(cookieParser())
const productRoutes = require('./routes/product');
const auth = require('./routes/auth');
const order=require('./routes/order.js')

app.use(express.json());
app.use('/api/v1', productRoutes);
app.use('/api/v1', auth);
app.use('/api/v1',order);



app.use(errorMiddleware);

module.exports = app;



