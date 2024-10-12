const app = require('./app');
const connectDatabase = require('./config/database.js');
require('dotenv').config();

connectDatabase();

const port = process.env.PORT || 5000;  
const mode = process.env.NODE_ENV || 'development'; 

const server = app.listen(port, () => {
    console.log(`My Server is listening on port: ${port} in ${mode} mode`);
});



process.on('unhandledRejection',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled rejection error');
    server.close(()=>{
        process.exit(1);
    })
})

process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to uncaught exception error');
    server.close(()=>{
        process.exit(1);
    })
})
