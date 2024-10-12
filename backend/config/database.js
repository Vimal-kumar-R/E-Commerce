const mongoose = require('mongoose'); // Import mongoose
const connectDatabase = () => {
    const db = process.env.DB_DATABASE || 'mongodb://127.0.0.1:5000/RLRVcart';
    
    console.log('DB_LOCAL_URI:', process.env.DB_DATABASE); // Debugging line
    mongoose.connect(db, {   
    }).then(con => {
        console.log(`MongoDB is connected to the host: ${con.connection.host}`);
    }).catch(error => {
        console.error('Database connection error:', error);
    });
};
module.exports = connectDatabase;

