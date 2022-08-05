const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require("cors");
const colors = require('colors');
// const path = require('path');
const errorHandler = require('./middlewares/error');
const connectDB = require('./config/db');
// const bodyParser = require('body-parser');

//load env vars
dotenv.config({path: './config.env'});


//Connect to database
connectDB();

//route files
const users = require('./routes/user.route');
const admins = require('./routes/admin.route');


const app = express();


//body parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//dev logging middleware
if(process.env.NODE_ENV==='development'){   //only when using dev env
    app.use(morgan('dev'));
}


//mount routers
app.use('/api/v1/users',users);
app.use('/api/v1/admin',admins);


//error middleware - should be at last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`));

//handle unhandled PromeseRejection
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`.red);
    
    //Close Server & exit process
    server.close(()=> process.exit(1));
})

