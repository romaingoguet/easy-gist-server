const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./api/routes');

require('dotenv').config();

const app = express();

app.use(helmet());
app.use(morgan('common'));
app.use(cors());
app.use(express.json());

app.use('', routes);

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message,
        stack: process.env.ENV === 'dev' ? error.stack : '👀'
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening at port ${port}`)
})