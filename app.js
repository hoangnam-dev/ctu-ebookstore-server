const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const router = require('./routes');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// parse application/json
app.use(bodyParser.json({limit: '50mb'}));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

const corsOptions ={
  origin:'http://localhost:3001', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}
app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'resources', 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

// Router
router(app);

module.exports = app;
