const express = require('express');
const app = express();
require('dotenv').config(); 

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser'); 
const mustacheExpress = require('mustache-express');


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 


const path = require('path');
const publicDirectory = path.join(__dirname, 'public');
app.use(express.static(publicDirectory));
app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));


const router = require('./routes/mainRoutes');
app.use(router);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port 3000. Ctrl^C to exit.`);
});
