// requirements
const routes = require('./controllers');
const path = require('path');
const express = require('express');
const helpers = require('./utils/helpers');
// set handlebars as template engine
const exphbs = require('express-handlebars');
// pass in helpers to handlebars
const hbs = exphbs.create({ helpers });
const session = require('express-session');

// necessary
const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require('./config/connection');
// require mnodule and pass in session store property
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// session obj
const sess = {
    // secret is used to sign the session cookie, when the cookie is read by the server it compares it with the secret to make sure the cookie is not modified by the client
    secret: 'Super secret secret',
    // empty at beginning
    cookie: {},
    // resave forces session to be saved to session.Store even if cookie hasnt been modified, default is true but it is deprecated and recommended is false
    resave: false,
    // when you make a new session, the session is saved as part of the store
    saveUninitialized: true,
    // initialize sequelize store and pass through db obj, this will set the connection with the database, set up the session table, and allow sequelize to save the data into the database
    store: new SequelizeStore({
        db: sequelize
    })
};

// call express-session middleware
app.use(session(sess));

// uses handlebars as TE 
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