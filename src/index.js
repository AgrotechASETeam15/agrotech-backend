const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');

const team = require('./routes/team');

const app = express();

const host = '0.0.0.0';
const port = process.env.SERVER_PORT || 8080;

app.set('port', port);
app.use(morgan(':method :url :status :response-time'));
app.use(cors()), app.use(express.json());
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
app.get('/', (req, res) => {
  return res.send('AgroTech Backend version 1.0.0');
});

app.listen(port, host, function () {
  console.log(`Server running on ${port} and host is ${host}`);
});
