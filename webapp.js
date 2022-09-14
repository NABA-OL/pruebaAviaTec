const express = require('express');
const aplicacion = express();
const session = require('express-session');
const flash = require('express-flash');
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const rutasMiddleware = require('./routes/middleware');
const rutasPublicas = require('./routes/publicas');
const rutasPrivadas = require('./routes/privadas');
const { application } = require('express');
const accessTokenSecret="youraccesstokensecret";

aplicacion.use(bodyParser.json());
aplicacion.use(express.json());
aplicacion.use(express.urlencoded({ extended: true }));
aplicacion.set("view engine", "ejs");
aplicacion.use(session({ secret: 'token-muy-secreto', resave: true, saveUninitialized: true }));
aplicacion.use(flash());
aplicacion.use(express.static('public'));
aplicacion.use(fileUpload());

aplicacion.use(rutasMiddleware);
aplicacion.use(rutasPublicas);
aplicacion.use(rutasPrivadas);

aplicacion.listen(8081, () => {
  console.log("Servidor iniciado");
});
