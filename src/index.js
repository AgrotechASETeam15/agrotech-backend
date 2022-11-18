const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');

const team = require('./routes/team');
const email = require('./routes/email');
const drip = require('./routes/drip');
const pestricide = require('./routes/pesticide');
const greenhouse = require('./routes/greenhouse');

const app = express();

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8080;

app.set('port', port);
app.use(morgan(':method :url :status :response-time'));
app.use(
  cors({
    origin: process.env.ORIGINS || [
      'http://0.0.0.0:3000',
      'http://localhost:3000',
      'https://agrotech-ase.herokuapp.com',
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'cookie_secret',
    name: 'cookie_name',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 40000,
    },
  })
);

app.use('/team', team);
app.use('/email', email);
app.use('/drip', drip);
app.use('/pesticides', pestricide);
app.use('/greenhouse', greenhouse);
app.get('/', (req, res) => {
  return res.send('AgroTech Backend version 1.0.0');
});

app.listen(port, host, function () {
  console.log(`Server running on ${port} and host is ${host}`);
});
