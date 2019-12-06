require('dotenv').config();
const express = require('express'),
      session = require('express-session'),
      {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env,
      massive = require('massive'),
      app = express(),
      authCtrl = require('./controllers/authController');
app.use(express.json());

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}))

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('db connected')
})

//endpoints
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);

app.listen(SERVER_PORT, () => console.log(`Server is listening on port ${SERVER_PORT}`))