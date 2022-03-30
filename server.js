// set handlebars as template engine
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
const path = require('path');
const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');

// necessary
const app = express();
const PORT = process.env.PORT || 3001;

// necessary 
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// takes contents of 'public' and serves it as a static asset ****
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes 
app.use(routes);

// turn on connection to db and server ** by forcing false, we make the tables recreate if there are any association changes like DROP TABLE IF EXISTS
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});