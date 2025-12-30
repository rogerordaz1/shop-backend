    require('dotenv').config();
    const bodyParser = require('body-parser');
    const express = require('express');  
    const morgan = require('morgan');
    const cors = require('cors');
    const mongoose = require('mongoose');


    const app = express();

    const PORT = process.env.PORT || 3000;
    const HOSTNAME = process.env.HOSTNAME || 'localhost';
    const MONGODB_URI = process.env.MONGODB_URI;

    app.use(bodyParser.json());
    app.use(morgan('tiny'));
    app.use(cors());





    
    mongoose.connect(MONGODB_URI).then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });


    // app.options('/*', cors());




    app.get('/', (req, res) => {
        res.send('Hello World!!!!');
    });



    app.listen(PORT, HOSTNAME, () => {
        console.log(`Server is running on port ${PORT} and hostname ${HOSTNAME}`);
    });