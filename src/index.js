const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const db = require('./config/db');
const app = express();
const port = 3001;
const route = require('./routes');

app.use(express.json());    
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Router
route(app);


app.listen(port, function() {
    console.log(`Server using Sequelize listening on http://localhost:${port}\n\n`);
})
